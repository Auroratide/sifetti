<script lang="ts" context="module">
    export class FettiboxCorners {
        readonly tl: number
        readonly tr: number
        readonly br: number
        readonly bl: number

        constructor(corners: { tl: number, tr: number, br: number, bl: number }) {
            this.tl = corners.tl
            this.tr = corners.tr
            this.br = corners.br
            this.bl = corners.bl
        }

        get style(): string {
            return `--tl: ${this.tl}; --tr: ${this.tr}; --br: ${this.br}; --bl: ${this.bl}`
        }

        static random = (): FettiboxCorners => new FettiboxCorners({
            tl: 2 * Math.random() / 3,
            tr: 2 * Math.random() / 3,
            br: 2 * Math.random() / 3,
            bl: 2 * Math.random() / 3,
        })
    }
</script>

<script lang="ts">
    import Skin from './Skin'

    export let color: Skin.Scheme = Skin.Fear

    let corners = FettiboxCorners.random()
</script>

<div class="fettibox" style="--color: {color}; {corners.style};">
    <slot></slot>
</div>

<style>
    .fettibox {
        --a: 1.5rem;
        position: relative;
        background: none;
        border-radius: 0;
        border: none;
        padding: var(--a);
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
        clip-path: polygon(
            calc(var(--a) * var(--tl)) calc(var(--a) * var(--tl)),
            calc(100% - var(--a) * var(--tr)) calc(var(--a) * var(--tr)),
            calc(100% - var(--a) * var(--br)) calc(100% - var(--a) * var(--br)),
            calc(var(--a) * var(--bl)) calc(100% - var(--a) * var(--bl))
        );
        z-index: -1;
    }
</style>