<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'

    export const load: Load = async ({ params }) => {
        return {
            props: {
                noteId: params.id,
                shouldRefresh: true,
            },
        }
    }
</script>

<script lang="ts">
    import type { Id } from '$lib/notes/types'
    import Note from '../../notes/[id].svelte'
    import { demoFetch } from '../_fetch'
    import { NotesApi } from '$lib/client/notes/api'
    import { TagsApi } from '$lib/client/tags/api'

    export let noteId: Id
    export let shouldRefresh: boolean
    
    $: api = new NotesApi($demoFetch)
    $: tagsApi = new TagsApi($demoFetch)
</script>

<Note {noteId} {api} {tagsApi} {shouldRefresh} />
