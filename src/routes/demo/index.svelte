<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'
    import { TagsApi } from '$lib/tags/api'
    import { createDemoFetch } from '$lib/demo/fetch'
    import { demoPerson } from '$lib/demo/data'
    import { createDemoProviders } from '$lib/demo/providers'

    export const load: Load = async () => {
        const fetch = createDemoFetch(await createDemoProviders())

        return {
            props: {
                person: demoPerson,
                notes: new NotesApi(fetch),
                tags: new TagsApi(fetch),
            },
        }
    }
</script>

<script lang="ts">
    import type { Person } from '$lib/people/types'
    import { onMount } from 'svelte'
    // import Me from '../me.svelte'

    export let person: Person
    export let notes: NotesApi
    export let tags: TagsApi

    let notesToShow = []

    onMount(() => {
        notes.getAll().then(n => notesToShow = n)
    })
</script>

<h1>Hello</h1>
<ul>
    {#each notesToShow as note}
        <li>{note.title}</li>
    {/each}
</ul>

<!-- <Me {person} {notes} {tags} /> -->
