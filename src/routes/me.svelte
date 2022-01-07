<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status'
    import { NotesApi } from '$lib/notes/api'

    export const load: Load = async ({ session, fetch }) => {
        if (session.person) {
            return {
                props: {
                    person: session.person,
                    notes: new NotesApi(fetch),
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
    import { goto } from '$app/navigation'
    import List from '$lib/notes/components/List.svelte'

    export let person: Person
    export let notes: NotesApi

    let promise = notes.getAll()

    const createNew = () => {
        return notes.create().then(ids => goto(ids.view))
    }
</script>

<p>Hi {person.email}!</p>
<p>This is your profile page.</p>

<button on:click={createNew}>Create New Note</button>

{#await promise}
    <p>Loading notes...</p>
{:then items}
    <List {items} />
{/await}
