<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'
    import { TagsApi } from '$lib/tags/api'
    import { requiresAuth } from '$lib/routing/requires-auth'

    export const load: Load = requiresAuth(async ({ session, fetch }) => {
        return {
            props: {
                person: session.person,
                notes: new NotesApi(fetch),
                tags: new TagsApi(fetch),
            },
        }
    })
</script>

<script lang="ts">
    import type { Person } from '$lib/people/types'
    import type { Tag } from '$lib/tags/types'
    import type { Note, WithTags } from '$lib/notes/types'
    import { goto } from '$app/navigation'
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
    import Font from '$lib/design/Font'
    import Navigation from '$lib/design/Navigation.svelte'
    import { onMount } from 'svelte'
    import Loader from '$lib/design/Loader.svelte'
    import { generator } from '$lib/design/random/context'
    import ToggleableTag from '$lib/tags/components/ToggleableTag.svelte'
    import Column from '$lib/design/Column.svelte'

    export let person: Person
    export let notes: NotesApi
    export let tags: TagsApi

    const headerCorners = FettiboxCorners.random(generator()).override({
        tl: 0,
        tr: 0,
        bl: 0,
        br: 0,
    })

    let loading = true

    let allNotes: (Note & WithTags)[] = []
    let allTags: Tag[] = []

    onMount(() => {
        Promise.all([
            notes.getAll(),
            tags.getAll(),
        ]).then(([ notes, tags ]) => {
            allNotes = notes
            allTags = tags
            loading = false
        })
    })

    let filteredTags: Tag[] = []
    let activeTags: Tag[] = []

    $: filteredNotes = allNotes.filter(note => activeTags.length === 0 || activeTags.every(tag => note.tags.map(it => it.id).includes(tag.id)))

    const toggleTag = (tag: Tag) => () => {
        if (activeTags.includes(tag))
            activeTags = activeTags.filter(it => it.id !== tag.id)
        else
            activeTags = [...activeTags, tag]
    }

    const createNew = () => {
        return notes.create().then(ids => goto(ids.view))
    }

    let sheathExpanded = false
    const unsheathFilter = () => sheathExpanded = true
    const resheathFilter = () => sheathExpanded = false
</script>

<Navigation color={Skin.Neutral} />
<main>
    <header>
        <Fettibox center spacing={Spacing.Dynamic.Oxygen} corners={headerCorners}>
            <Title color={Skin.Fear.Text} value="My Profile">{person.email}</Title>        
        </Fettibox>
    </header>
    {#if loading}
        <div class="loader">
            <Loader />
        </div>
    {:else}
        <div class="content-area">
            <section class="notes">
                <div class="notes-header">
                    <h2>Notes</h2>
                    <Button size={Font.Size.Mars} spacing={Spacing.Static.Carbon} color={Skin.Disgust} on:click={createNew}>Create New Note</Button>
                </div>
                <ul class="note-list">
                    {#each filteredNotes as note}
                        <li><Fetticard label={note.title}>
                            <section class="note-card-content">
                                <a href="/notes/{note.id}">{note.title}</a>
                                {#if note.tags?.length > 0}
                                    <div class="tags">
                                        <TagList spacing={Spacing.Static.Hydrogen} tags={note.tags} let:tag>
                                            <span class="tag" class:active={activeTags.find(it => it.id === tag.id) !== undefined}>{tag.name}</span>
                                        </TagList>
                                    </div>
                                {/if}
                            </section>
                        </Fetticard></li>
                    {/each}
                    <li class="create-new"><Button size={Font.Size.Venus} spacing={Spacing.Static.Magnesium} color={Skin.Disgust} on:click={createNew}>Create New Note</Button></li>
                </ul>
            </section>
            <Sheathed bind:expanded={sheathExpanded}>
                <aside class="filtering">
                    <h2>Filtering</h2>
                    <div class="filtering-sheath-button">
                        <Button label="Dismiss filtering options" on:click={resheathFilter} spacing={Spacing.Static.Oxygen} color={Skin.Joy}>v</Button>
                    </div>
                    <Column>
                        <TagFilter tags={allTags} bind:filtered={filteredTags} />
                        <TagList tags={filteredTags} font={Font.Size.Venus} let:tag>
                            <ToggleableTag {tag} on:click={toggleTag(tag)} active={activeTags.find(it => it.id === tag.id) !== undefined} />
                        </TagList>
                    </Column>
                </aside>
                <Button slot="activator" on:click={unsheathFilter} elevation={Elevation.Cumulus}>Filter</Button>
            </Sheathed>
        </div>
    {/if}
</main>

<style lang="scss">
    header {
        margin-bottom: var(--sp-dy-o);
    }

    .loader {
        min-height: 75vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .content-area {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--sp-dy-c);
        padding: 0 var(--sp-dy-c);

        h2 {
            font-size: var(--font-sz-neptune);
            font-weight: var(--font-wt-b);
            margin-bottom: var(--sp-st-be);
        }
    }

    .notes-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
    }

    .note-list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-gap: var(--sp-dy-be);
        grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));

        .create-new {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .note-card-content {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--sp-st-he);

        a {
            text-decoration: none;
            color: var(--skin-content-text);
        }

        .tags {
            font-size: var(--font-sz-mars);
            color: var(--skin-sad);
            margin: 0 calc(-1 * var(--sp-st-he));

            .tag {
                display: inline-block;
                margin: 0 var(--sp-st-he);

                &.active {
                    font-weight: var(--font-wt-b);
                }
            }
        }
    }

    .filtering {
        position: relative;

        .filtering-sheath-button {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    @media screen and (min-width: 50rem) {
        .content-area {
            grid-template-columns: 2fr 1fr;
        }

        .filtering-sheath-button {
            display: none;
        }
    }
</style>