<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status'
    import { NotesApi } from '$lib/notes/api'
    import { TagsApi } from '$lib/tags/api'

    export const load: Load = async ({ session, fetch }) => {
        if (session.person) {
            return {
                props: {
                    person: session.person,
                    notes: new NotesApi(fetch),
                    tags: new TagsApi(fetch),
                },
            }
        } else {
            return {
                status: HttpStatus.Found,
                redirect: '/sign-in',
            }
        }
    }
</script>

<script lang="ts">
    import type { Person } from '$lib/people/types'
    import type { Tag } from '$lib/tags/types'
    import type { Note, WithTags } from '$lib/notes/types'
    import { goto } from '$app/navigation'
    import NoteList from '$lib/notes/components/NoteList.svelte'
    import TagFilter from '$lib/tags/components/TagFilter.svelte'
    import TagList from '$lib/tags/components/TagList.svelte'
    import Title from '$lib/design/Title.svelte'
    import Button from '$lib/design/Button.svelte'
    import Fettibox, { FettiboxCorners } from '$lib/design/Fettibox.svelte'
    import Spacing from '$lib/design/Spacing'
    import Skin from '$lib/design/Skin'
    import Fetticard from '$lib/design/Fetticard.svelte'
    import Sheathed from '$lib/design/Sheathed.svelte'
    import Elevation from '$lib/design/Elevation'

    export let person: Person
    export let notes: NotesApi
    export let tags: TagsApi

    const headerCorners = FettiboxCorners.random().override({
        tl: 0,
        tr: 0,
        bl: 0,
        br: 0,
    })

    let allNotes: (Note & WithTags)[] = []

    let promise = notes.getAll().then(n => allNotes = n)
    let tagsPromise = tags.getAll()

    let filteredTags: Tag[] = []
    let activeTags: Tag[] = []

    let sheathExpanded = false

    $: filteredNotes = allNotes.filter(note => activeTags.length === 0 || note.tags.some(t => activeTags.map(it => it.id).includes(t.id)))

    const toggleTag = (tag: Tag) => () => {
        if (activeTags.includes(tag))
            activeTags = activeTags.filter(it => it.id !== tag.id)
        else
            activeTags = [...activeTags, tag]
    }

    const createNew = () => {
        return notes.create().then(ids => goto(ids.view))
    }

    const unsheathFilter = () => sheathExpanded = true
    const resheathFilter = () => sheathExpanded = false
</script>

<main>
    <header>
        <Fettibox center spacing={Spacing.Dynamic.Oxygen} corners={headerCorners}>
            <Title color={Skin.Fear.Text} value="My Profile">{person.email}</Title>        
        </Fettibox>
    </header>
    <div class="content-area">
        <section class="notes">
            <h2>Notes</h2>
            {#await promise}
                <p>Loading notes...</p>
            {:then items}
                <ul class="note-list">
                    {#each filteredNotes as note}
                        <li><Fetticard label={note.title}>
                            <a href="/notes/{note.id}">{note.title}</a>
                        </Fetticard></li>
                    {/each}
                </ul>
            {/await}
        </section>
        <Sheathed bind:expanded={sheathExpanded}>
            <aside class="filterng">
                <h2>Filtering</h2>
                <Button on:click={resheathFilter}>Bye</Button>
                {#await tagsPromise}
                    <p>Loading tags...</p>
                {:then items}
                    <TagFilter tags={items} bind:filtered={filteredTags} />
                    <TagList tags={filteredTags} let:tag>
                        <Button on:click={toggleTag(tag)}>{tag.name}</Button>
                    </TagList>
                {/await}
            </aside>
            <Button slot="activator" on:click={unsheathFilter} elevation={Elevation.Cumulus}>Filter</Button>
        </Sheathed>
    </div>
    <section>
        <p><a href="/sign-out">Sign out</a></p>
        <Button color={Skin.Disgust} on:click={createNew}>Create New Note</Button>
    </section>
</main>

<style lang="scss">
    header {
        margin-bottom: var(--sp-dy-o);
    }

    .content-area {
        display: flex;
        padding: 0 var(--sp-dy-c);

        h2 {
            font-size: var(--font-sz-neptune);
            font-weight: var(--font-wt-b);
            margin-bottom: var(--sp-st-he);
        }
    }

    .notes {
        flex: 1;
    }

    .note-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-wrap: wrap;

        li {
            margin: 0.5rem;
            font-size: var(--font-sz-neptune);
        }
    }
</style>