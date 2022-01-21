<script lang="ts">
    import type { Tag } from '../types'
    import Spacing from '../../design/Spacing'
    import Button from '../../design/Button.svelte'

    export let tag: Tag
    export let active: boolean = false
</script>

<Button spacing={Spacing.Static.Oxygen} on:click>
    <span class="tag-button-content">
        <span class="tag-name">{tag.name}</span>
        <span class="tag-added" class:visible={active}>✔</span>
    </span>
</Button>

<style lang="scss">
    @import '../../design/mixins.scss';

    .tag-button-content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .tag-added {
        font-size: var(--font-sz-venus);
        position: relative;
        left: var(--sp-st-be);
        visibility: hidden;
        color: var(--skin-sad);
        background-color: var(--skin-sad-text);

        @include fettibox(var(--sp-st-h), var(--sp-st-be), var(--skin-sad-text));
    }
    
    .tag-added.visible {
        visibility: visible;
    }
</style>