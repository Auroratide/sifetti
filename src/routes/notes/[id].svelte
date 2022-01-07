<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'

    export const load: Load = async ({ page, fetch }) => {
        const api = new NotesApi(fetch)
        const note = await api.getById(page.params.id)

        return {
            props: {
                api,
                note,
            }
        }
    }
</script>

<script lang="ts">
    import type { Note } from '$lib/notes/types'

    export let api: NotesApi
    export let note: Note

    let currentContent: string = note.content

    const save = () => {
        return api.edit(note.id, {
            title: note.title,
            content: currentContent
        }).then(() => {
            alert('Saved!')
        }).catch(err => {
            alert(err)
        })
    }
</script>

<h1>{note.title}</h1>
<textarea bind:value={currentContent}></textarea>
<button on:click={save}>Save</button>
<a href="/me">Back</a>
