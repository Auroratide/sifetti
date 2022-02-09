<script lang="ts" context="module">
    import type { Id as NoteId } from '$lib/notes/types'
    import { linktoKey, LinkTo } from '$lib/routing/linkto'

    class DemoLinkTo extends LinkTo {
        note = (id: NoteId) => `/demo/notes/${id}`
    }
</script>

<script lang="ts">
    import { setContext } from 'svelte'

    setContext(linktoKey, new DemoLinkTo())
</script>

<slot></slot>
