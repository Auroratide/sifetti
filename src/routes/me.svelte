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

    export let person: Person
    export let notes: NotesApi
    export let tags: TagsApi

    let allNotes: (Note & WithTags)[] = []

    let promise = notes.getAll().then(n => allNotes = n)
    let tagsPromise = tags.getAll()

    let filteredTags: Tag[] = []
    let activeTags: Tag[] = []

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
</script>

<Title value="My Profile" />

<p>Hi {person.email}!</p>
<p>This is your profile page.</p>

<p><a href="/sign-out">Sign out</a></p>

{#await tagsPromise}
    <p>Loading tags...</p>
{:then items}
    <TagFilter tags={items} bind:filtered={filteredTags} />
    <TagList tags={filteredTags} let:tag>
        <Button on:click={toggleTag(tag)}>{tag.name}</Button>
    </TagList>
{/await}

<button on:click={createNew}>Create New Note</button>

{#await promise}
    <p>Loading notes...</p>
{:then items}
    <NoteList items={filteredNotes} />
{/await}
