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
</script>

<p>You are looking at note {note.id}.</p>
<p>{note.content}</p>
