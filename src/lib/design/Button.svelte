<script lang="ts">
    import Skin from './Skin'
    import Elevation from './Elevation'
    import { FettiboxCorners } from './Fettibox.svelte'

    export let submit: boolean = false
    export let disabled: boolean = false

    export let color: Skin.Scheme = Skin.Sad
    export let elevation: Elevation.Shadow = Elevation.Stratus

    let corners = FettiboxCorners.random(0.25)
    
    $: type = submit ? 'submit' : undefined
</script>

<button {type} {disabled} on:click style="--color: {color}; --color-text: {color.Text}; --dropshadow: {elevation}; {corners.style};"><slot></slot></button>

<style lang="scss">
    @import './mixins.scss';

    button {
        @include reset-fettibox-vars;

        --pad-tb: var(--sp-st-c);
        --pad-lr: var(--sp-st-mg);
        font-size: var(--font-sz-earth);
        color: var(--color-text);
        cursor: pointer;
        filter: var(--dropshadow);

        @include fettibox;
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