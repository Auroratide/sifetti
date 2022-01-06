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
    import List from '$lib/notes/components/List.svelte'

    export let person: Person
    export let notes: NotesApi

    let promise = notes.getAll()
</script>

<p>Hi {person.email}!</p>
<p>This is your profile page.</p>

{#await promise}
    <p>Loading notes...</p>
{:then items}
    <List {items} />
{/await}
