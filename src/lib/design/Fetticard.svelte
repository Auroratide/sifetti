<script lang="ts">
    import { FettiboxCorners } from './Fettibox.svelte'

    export let label: string

    const corners = FettiboxCorners.random(0.15)
</script>

<article class="fetticard" aria-label={label} style="{corners.style};">
    <slot></slot>
</article>

<style lang="scss">
    @import './mixins.scss';

    .fetticard {
        --color: var(--skin-content);
        --pad-tb: var(--sp-st-o);
        --pad-lr: var(--sp-st-mg);
        filter: drop-shadow(0 0.125rem 0.125rem hsla(0, 0%, 0%, 25%));

        @include fettibox;

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