<script lang="ts">
    import type { Tag } from '../types'

    export let tags: Tag[]
</script>

<ul class="tag-list">
    {#each tags as tag}
        <li class="tag"><slot {tag}>{tag.name}</slot></li>
    {/each}
</ul>

<style lang="scss">
    .tag-list {
        font-size: var(--font-sz-venus);
        margin: 0 -0.25em 1em;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        align-items: flex-start;

        li.tag {
            margin: 0 0.25em;
        }
    }
</style>