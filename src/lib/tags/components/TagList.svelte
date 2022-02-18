<script lang="ts">
    import type { Tag } from '../types'
    import Spacing from '../../client/design/quark/Spacing'
    import Font from '../../client/design/quark/Font'
    import StaticTag from './StaticTag.svelte'

    export let tags: Tag[]
    export let font: Font.Size = Font.Size.Earth
    export let spacing: Spacing.Size = Spacing.Static.Helium

    $: sorted = tags.sort((l, r) => l.name.localeCompare(r.name))
</script>

<ul class="tag-list" style="--font-sz: {font}; --spacing: {spacing};">
    {#each sorted as tag}
        <li class="tag">
            <slot {tag}><StaticTag>{tag.name}</StaticTag></slot>
        </li>
    {/each}
</ul>

<style lang="scss">
    .tag-list {
        display: inline;
        font-size: var(--font-sz);
        margin: 0 calc(-1 * var(--spacing));
        list-style: none;
        padding: 0;

        li.tag {
            display: inline-block;
            margin: 0 var(--spacing) var(--spacing);
        }
    }
</style>