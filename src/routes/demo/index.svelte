<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { demoPerson } from '$lib/demo/data'

    export const load: Load = async ({ }) => {
        return {
            props: {
                person: demoPerson,
            },
        }
    }
</script>

<script lang="ts">
    import type { Person } from '$lib/shared/people/types'
    import { demoFetch } from './_fetch'
    import { NotesApi } from '$lib/client/notes/api'
    import { TagsApi } from '$lib/client/tags/api'
    import Me from '../me/index.svelte'

    export let person: Person
    
    $: notes = new NotesApi($demoFetch)
    $: tags = new TagsApi($demoFetch)
</script>

<Me {person} {notes} {tags} />
