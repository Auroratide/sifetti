<script lang="ts">
    import type { Note } from '../types'

    export let items: Note[]
</script>

<ul>
    {#each items as item}
        <li>{item.title}</li>
    {/each}
</ul>
