<script lang="ts">
    import type { Tag } from '../types'
    import Spacing from '../../design/Spacing'
    import Font from '../../design/Font'
    import StaticTag from './StaticTag.svelte'

    export let tags: Tag[]
    export let font: Font.Size = Font.Size.Earth
    export let spacing: Spacing.Size = Spacing.Static.Helium
</script>

<ul class="tag-list" style="--font-sz: {font}; --spacing: {spacing};">
    {#each tags as tag}
        <li class="tag">
            <slot {tag}><StaticTag>{tag.name}</StaticTag></slot>
        </li>
    {/each}
</ul>

<style lang="scss">
    .tag-list {
        font-size: var(--font-sz);
        margin: 0 calc(-1 * var(--spacing));
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        align-items: flex-start;

        li.tag {
            margin: 0 var(--spacing) var(--spacing);
        }
    }
</style>