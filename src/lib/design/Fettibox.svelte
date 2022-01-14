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

        static random = (factor: number = 0.667): FettiboxCorners => new FettiboxCorners({
            tl: factor * Math.random(),
            tr: factor * Math.random(),
            br: factor * Math.random(),
            bl: factor * Math.random(),
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

<style lang="scss">
    @import './mixins.scss';

    .fettibox {
        --pad: var(--sp-st-mg);
        filter: drop-shadow(0 0.125rem 0.125rem hsla(0, 0%, 0%, 25%));

        @include fettibox;
    }
</style>