<script lang="ts">
    import { FettiboxCorners } from './Fettibox.svelte'
    import { generator } from './random/context'

    export let label: string

    const corners = FettiboxCorners.random(generator(), 0.15)
</script>

<article class="fetticard" aria-label={label} style="{corners.style};">
    <slot></slot>
</article>

<style lang="scss">
    @import './mixins.scss';

    .fetticard {
        filter: var(--elev-stratus);

        @include fettibox(var(--sp-st-o), var(--sp-dy-c), var(--skin-content));

        :global(a)::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 2;
        }
    }
</style>