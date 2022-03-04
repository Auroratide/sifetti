<script lang="ts">
    import Font from '../quark/Font'
    import Skin from '../quark/Skin'
    import Elevation from '../quark/Elevation'
    import Spacing from '../quark/Spacing'
    import { FettiboxCorners } from './Fettibox.svelte'
    import { generator } from '../random/context'

    export let href: string

    export let color: Skin.Scheme = Skin.Sad
    export let size: Font.Size = Font.Size.Earth
    export let elevation: Elevation.Shadow = Elevation.Stratus
    export let spacing: Spacing.Size = Spacing.Static.Magnesium

    let corners = FettiboxCorners.random(generator(), 0.25)
</script>

<a
    {href}
    style:--font-sz-local={size}
    style:--elev-local={elevation}
    style:--sp-local={spacing}
    style:--skin-local={color.toString()}
    style:--skin-local-text={color.Text.toString()}
    style:--skin-local-hover={color.Hover.toString()}
    style="{corners.style};"    
>
    <slot></slot>
</a>

<style lang="scss">
    @import '../mixins.scss';

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

    a:hover::before,
    a:focus::before {
        background-color: var(--skin-local-hover);
    }

    a:active {
        filter: var(--elev-ground);

        &::before {
            transform: scale(0.95);
        }
    }
</style>