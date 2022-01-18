<script lang="ts">
    import type { Tag } from '../types'
    import StaticTag from './StaticTag.svelte'

    export let tags: Tag[]
</script>

<ul class="tag-list">
    {#each tags as tag}
        <li class="tag">
            <slot {tag}><StaticTag>{tag.name}</StaticTag></slot>
        </li>
    {/each}
</ul>

<style lang="scss">
    .tag-list {
        font-size: var(--font-sz-venus);
        margin: 0 calc(-1 * var(--sp-st-he));
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        align-items: flex-start;

        li.tag {
            margin: 0 var(--sp-st-he) var(--sp-st-he);
        }
    }
</style>