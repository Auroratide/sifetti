<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    export const load: Load = async ({ page, fetch }) => {
        const res = await fetch('/api/notes')

        if (res.ok) {
            return {
                props: {
                    notes: (await res.json()).items,
                }
            }
        }
    }
</script>

<script lang="ts">
    import { goto } from '$app/navigation'
    import type { Note } from '$lib/notes/types'

    export let notes: Note[]

    const handleClick = () => {
        fetch('/api/notes', {
            method: 'POST',
        }).then(res => {
            return goto(res.headers.get('Location').substring(4))
        })
    }
</script>

<ul>
    {#each notes as note}
        <li><a href="/notes/{note.id}">Note {note.id}</a></li>
    {/each}
</ul>
<button on:click={handleClick}>Create New</button>