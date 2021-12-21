<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    export const load: Load = async ({ page, fetch }) => {
        const res = await fetch(`/api/notes/${page.params.id}`)

        if (res.ok) {
            return {
                props: {
                    note: await res.json(),
                }
            }
        }
    }
</script>

<script lang="ts">
    export let note: {
        id: string,
        content: string,
    }

    let currentContent: string = note.content

    const save = () => {
        fetch(`/api/notes/${note.id}/edits`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: currentContent,
            })
        }).then(() => {
            alert('Saved!')
        })
    }
</script>

<p>You are looking at note {note.id}.</p>
<textarea bind:value={currentContent}></textarea>
<button on:click={save}>Save</button>
<a href="/notes">Back</a>