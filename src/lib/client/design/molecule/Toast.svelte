<script lang="ts" context="module">
    import { writable } from 'svelte/store'

    enum MessageType {
        Success = 'success',
        Problem = 'problem',
    }

    const open = writable(false)
    const type = writable(MessageType.Problem)
    const message = writable('')

    const show = (newMessage: string, newType: MessageType) => {
        message.set(newMessage)
        type.set(newType)
        open.set(true)
    }

    export const toast = {
        success: (newMessage: string) => {
            show(newMessage, MessageType.Success)

            setTimeout(() => open.set(false), 5000)
        },
        problem: (newMessage: string) => {
            show(newMessage, MessageType.Problem)

            setTimeout(() => open.set(false), 5000)
        },
        dismiss: () => {
            open.set(false)
        },
    }
</script>

<script lang="ts">
    import Fettibox from '../atom/Fettibox.svelte'
    import Skin from '../quark/Skin'
    import Elevation from '../quark/Elevation'
    import Spacing from '../quark/Spacing'

    export let id: string

    $: skin = $type === MessageType.Problem ? Skin.Anger : Skin.Disgust
</script>

<div {id} role="dialog" aria-labelledby="{id}-message" class="toast" class:open={$open}>
    <Fettibox color={skin} elevation={Elevation.Cirrus} spacing={Spacing.Dynamic.Berylium} unclippedSpace={Spacing.Dynamic.Berylium}>
        <p id="{id}-message">{$message}</p>
        <button aria-label="Dismiss" on:click={toast.dismiss}>X</button>
    </Fettibox>
</div>

<style>
    .toast {
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

    .toast.open {
        bottom: var(--sp-dy-o);
        opacity: 1;
    }

    button {
        position: absolute;
        font-size: var(--font-sz-uranus);
        top: var(--sp-st-he);
        right: var(--sp-st-he);
        color: var(--skin-local);
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