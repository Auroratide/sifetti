<script lang="ts">
    import type { Note } from '$lib/shared/notes/types'

    export let items: Note[]
</script>

<ul>
    {#each items as item}
        <li><a href="/notes/{item.id}">{item.title}</a></li>
    {/each}
</ul>
