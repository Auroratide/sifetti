<script lang="ts">
    export let submit: boolean = false
    
    $: type = submit ? 'submit' : undefined
</script>

<button {type} on:click><slot></slot></button>

<style lang="scss">
    button {
        --a: 0.25rem;
        font-size: var(--font-sz-md);
        position: relative;
        background: none;
        border-radius: 0;
        border: none;
        padding: 0.75rem;
        color: var(--skin-joy-text);
        cursor: pointer;
        filter: drop-shadow(0 0.125rem 0.125rem hsla(0, 0%, 0%, 25%));
        z-index: 1;
    }
    
    button::before {
        position: absolute;
        content: '';
        background-color: var(--skin-joy);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        clip-path: polygon(0% var(--a), 100% 0%, calc(100% - var(--a)) calc(100% - var(--a)), var(--a) 100%);
        z-index: -1;
    }

    button:hover {
        transform: scale(1.05);
    }
</style>