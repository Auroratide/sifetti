<script lang="ts">
    import Font from '../quark/Font'
    import Skin from '../quark/Skin'
    import Elevation from '../quark/Elevation'
    import Spacing from '../quark/Spacing'
    import { FettiboxCorners } from './Fettibox.svelte'
    import { generator } from '../random/context'

    export let submit: boolean = false
    export let disabled: boolean = false
    export let label: string = undefined

    export let color: Skin.Scheme = Skin.Sad
    export let size: Font.Size = Font.Size.Earth
    export let elevation: Elevation.Shadow = Elevation.Stratus
    export let spacing: Spacing.Size = Spacing.Static.Magnesium

    let corners = FettiboxCorners.random(generator(), 0.25)
    
    $: type = submit ? 'submit' : undefined
</script>

<button
    {type}
    {disabled}
    aria-label={label}
    on:click
    style="--font-sz-local: {size}; --elev-local: {elevation}; --sp-local: {spacing}; --skin-local: {color}; --skin-local-text: {color.Text}; {corners.style};"
>
    <slot></slot>
</button>

<style lang="scss">
    @import '../mixins.scss';

    button {
        font-size: var(--font-sz-local);
        color: var(--skin-local-text);
        cursor: pointer;
        filter: var(--elev-local);

        @include fettibox(calc(var(--sp-local) / 2), var(--sp-local), var(--skin-local));
    }

    button:not([disabled]):hover {
        transform: scale(1.05);
    }

    button:not([disabled]):active {
        transform: scale(0.9);
        filter: var(--elev-ground);
    }

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>