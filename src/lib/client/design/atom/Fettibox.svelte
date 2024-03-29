<script lang="ts" context="module">
    import type { RandomGenerator } from '../random/generators'

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

        override = (corners: { tl?: number, tr?: number, br?: number, bl?: number }): FettiboxCorners => new FettiboxCorners({
            tl: corners.tl ?? this.tl,
            tr: corners.tr ?? this.tr,
            br: corners.br ?? this.br,
            bl: corners.bl ?? this.bl,
        })

        static random = (generator: RandomGenerator, factor: number = 0.667): FettiboxCorners => new FettiboxCorners({
            tl: factor * generator.next(),
            tr: factor * generator.next(),
            br: factor * generator.next(),
            bl: factor * generator.next(),
        })

        static zero = () => new FettiboxCorners({ tl: 0, tr: 0, br: 0, bl: 0 })
    }
</script>

<script lang="ts">
    import Skin from '../quark/Skin'
    import Spacing from '../quark/Spacing'
    import Elevation from '../quark/Elevation'
    import Font from '../quark/Font'
    import { generator } from '../random/context'

    export let color: Skin.Scheme = Skin.Fear
    export let spacing: Spacing.Size = Spacing.Dynamic.Magnesium
    export let unclippedSpace: Spacing.Size = Spacing.None
    export let elevation: Elevation.Shadow = Elevation.Stratus
    export let size: Font.Size = Font.Size.Earth
    export let corners: FettiboxCorners = FettiboxCorners.random(generator())
    export let center: boolean = false
</script>

<div class="fettibox" class:center style="--font-sz-local: {size}; --skin-local: {color}; --skin-local-text: {color.Text}; --sp-local: {spacing}; --sp-local-unclipped: {unclippedSpace}; --elev-local: {elevation}; {corners.style};">
    <slot></slot>
</div>

<style lang="scss">
    @import '../mixins.scss';

    .fettibox {
        font-size: var(--font-sz-local);
        color: var(--skin-local-text);
        filter: var(--elev-local);

        @include fettibox(var(--sp-local), var(--sp-local), var(--skin-local), var(--sp-local-unclipped));
    }

    .fettibox.center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>