<script lang="ts">
    import type { Tag } from '../types'
    import Button from '../../design/Button.svelte'

    export let tags: Tag[]
</script>

<ul class="tag-list">
    {#each tags as tag}
        <li class="tag">{tag.name}</li>
    {/each}
</ul>

<style lang="scss">
    .tag-list {
        font-size: var(--font-sz-sm);
        margin: 0 -0.25em 1em;
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        align-items: flex-start;

        li.tag {
            --a: 0.125rem;
            background-color: var(--skin-sad);
            color: var(--skin-sad-text);
            padding: calc(4 * var(--a)) calc(8 * var(--a));
            clip-path: polygon(0% var(--a), 100% 0%, calc(100% - var(--a)) calc(100% - var(--a)), var(--a) 100%);
            margin: 0 0.25em;
        }
    }
</style>