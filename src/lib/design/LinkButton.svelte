<script lang="ts">
    import Font from './Font'
    import Skin from './Skin'
    import Elevation from './Elevation'
    import Spacing from './Spacing'
    import { FettiboxCorners } from './Fettibox.svelte'
    import { generator } from './random/context'

    export let href: string

    export let color: Skin.Scheme = Skin.Sad
    export let size: Font.Size = Font.Size.Earth
    export let elevation: Elevation.Shadow = Elevation.Stratus
    export let spacing: Spacing.Size = Spacing.Static.Magnesium

    let corners = FettiboxCorners.random(generator(), 0.25)
</script>

<a {href} style="--font-sz-local: {size}; --elev-local: {elevation}; --sp-local: {spacing}; --skin-local: {color}; --skin-local-text: {color.Text}; {corners.style};">
    <slot></slot>
</a>

<style lang="scss">
    @import './mixins.scss';

    a {
        display: inline-block;
        font-size: var(--font-sz-local);
        color: var(--skin-local-text);
        cursor: pointer;
        filter: var(--elev-local);
        text-decoration: none;
        text-align: center;

        @include fettibox(calc(var(--sp-local) / 2), var(--sp-local), var(--skin-local));
    }

    a:hover {
        transform: scale(1.05);
    }

    a:active {
        transform: scale(0.9);
        filter: var(--elev-ground);
    }
</style>