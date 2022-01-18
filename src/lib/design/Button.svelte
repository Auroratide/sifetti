<script lang="ts">
    import Skin from './Skin'
    import Elevation from './Elevation'
    import Spacing from './Spacing'
    import { FettiboxCorners } from './Fettibox.svelte'

    export let submit: boolean = false
    export let disabled: boolean = false
    export let label: string = undefined

    export let color: Skin.Scheme = Skin.Sad
    export let elevation: Elevation.Shadow = Elevation.Stratus
    export let spacing: Spacing.Size = Spacing.Static.Magnesium

    let corners = FettiboxCorners.random(0.25)
    
    $: type = submit ? 'submit' : undefined
</script>

<button
    {type}
    {disabled}
    aria-label={label}
    on:click
    style="--elev-local: {elevation}; --sp-local: {spacing}; --skin-local: {color}; --skin-local-text: {color.Text}; {corners.style};"
>
    <slot></slot>
</button>

<style lang="scss">
    @import './mixins.scss';

    button {
        font-size: var(--font-sz-earth);
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
    }

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>