<script lang="ts">
    import Skin from './Skin'

    export let color: Skin.Scheme = Skin.Fear
</script>

<div class="fettibox" style="--color: {color};">
    <slot></slot>
</div>

<style>
    .fettibox {
        --a: 0.5rem;
        position: relative;
        background: none;
        border-radius: 0;
        border: none;
        padding: 1.5rem;
        filter: drop-shadow(0 0.125rem 0.125rem hsla(0, 0%, 0%, 25%));
        z-index: 1;
    }

    .fettibox::before {
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
</style>