<script lang="ts">
    import Skin from './Skin'

    export let submit: boolean = false
    export let disabled: boolean = false

    export let color: Skin.Scheme = Skin.Sad
    
    $: type = submit ? 'submit' : undefined
</script>

<button {type} {disabled} on:click style="--color: {color}; --color-text: {color.Text};"><slot></slot></button>

<style lang="scss">
    button {
        --a: 0.25rem;
        font-size: var(--font-sz-md);
        position: relative;
        background: none;
        border-radius: 0;
        border: none;
        padding: 0.75rem;
        color: var(--color-text);
        cursor: pointer;
        filter: drop-shadow(0 0.125rem 0.125rem hsla(0, 0%, 0%, 25%));
        z-index: 1;
    }
    
    button::before {
        position: absolute;
        content: '';
        background-color: var(--color);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        clip-path: polygon(0% var(--a), 100% 0%, calc(100% - var(--a)) calc(100% - var(--a)), var(--a) 100%);
        z-index: -1;
    }

    button:not([disabled]):hover {
        transform: scale(1.05);
    }

    button[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>