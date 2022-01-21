<script lang="ts" context="module">
    import { writable } from 'svelte/store'

    const open = writable(false)
    const message = writable('')

    export const toastError = {
        show: (newMessage: string) => {
            message.set(newMessage)
            open.set(true)

            setTimeout(() => open.set(false), 5000)
        },
        dismiss: () => {
            open.set(false)
        },
    }
</script>

<script lang="ts">
    import Fettibox from './Fettibox.svelte'
    import Skin from './Skin'
    import Elevation from './Elevation'
    import Spacing from './Spacing'

    export let id: string
</script>

<div {id} role="dialog" aria-labelledby="{id}-message" class="toast-error" class:open={$open}>
    <Fettibox color={Skin.Anger} elevation={Elevation.Cirrus} spacing={Spacing.Dynamic.Berylium} unclippedSpace={Spacing.Dynamic.Berylium}>
        <p id="{id}-message">{$message}</p>
        <button aria-label="Dismiss" on:click={toastError.dismiss}>X</button>
    </Fettibox>
</div>

<style>
    .toast-error {
        position: fixed;
        left: 50%;
        width: min(90vw, 30em);
        transform: translateX(-50%);
        font-size: var(--font-sz-venus);
        text-align: center;
        z-index: 1000;
        bottom: calc(-1 * var(--sp-dy-o));
        opacity: 0;
        transition: all 0.4s ease-in-out;
    }

    .toast-error.open {
        bottom: var(--sp-dy-o);
        opacity: 1;
    }

    button {
        position: absolute;
        font-size: var(--font-sz-uranus);
        top: var(--sp-st-he);
        right: var(--sp-st-he);
        color: var(--skin-anger);
        filter: brightness(0.5);
        background: none;
        border: none;
        cursor: pointer;
        margin: 0;
        padding: var(--sp-st-be);
    }

    button:hover, button:active {
        color: var(--skin-anger-text);
        filter: none;
    }

    p {
        margin: 0;
    }
</style>