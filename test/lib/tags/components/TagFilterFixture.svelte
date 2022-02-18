<script lang="ts">
    import type { Tag } from '../../../../src/lib/shared/tags/types'
    import TagFilter from '../../../../src/lib/tags/components/TagFilter.svelte'

    export let tags: Tag[]

    let filtered: Tag[] = []
</script>

<TagFilter tags={tags} bind:filtered={filtered} />
<ul>
    {#each filtered as item}
        <li>{item.name}</li>
    {/each}
</ul>
