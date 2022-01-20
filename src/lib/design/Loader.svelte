<script lang="ts">
    import Fettibox from './Fettibox.svelte'
    import Elevation from './Elevation'
    import Spacing from './Spacing'
    import Skin from './Skin'
    import Font from './Font'

    export let color: Skin.Scheme = Skin.Fear
    export let size: Font.Size = Font.Size.Earth
</script>

<div class="loader" aria-label="Loading content..." style="--font-sz-local: {size};">
    <div class="dot" style="--anim-delay: 0;">
        <Fettibox {color} elevation={Elevation.Ground} unclippedSpace={Spacing.Static.Oxygen} spacing={Spacing.Static.Magnesium} />
    </div>
    <div class="dot" style="--anim-delay: 0.333;">
        <Fettibox {color} elevation={Elevation.Ground} unclippedSpace={Spacing.Static.Oxygen} spacing={Spacing.Static.Magnesium} />
    </div>
    <div class="dot" style="--anim-delay: 0.667;">
        <Fettibox {color} elevation={Elevation.Ground} unclippedSpace={Spacing.Static.Oxygen} spacing={Spacing.Static.Magnesium} />
    </div>
</div>

<style lang="scss">
    .loader {
        --anim-duration: 1s;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-sz-local);

        .dot {
            margin: 0 var(--sp-st-be);
            animation: loader-blink var(--anim-duration) step-end infinite calc(var(--anim-duration) * var(--anim-delay));
        }
    }

    @media (prefers-reduced-motion) {
        .loader .dot {
            animation: loader-fade calc(2 * var(--anim-duration)) ease-in-out infinite;
        }
    }

    @keyframes loader-blink {
        0% { opacity: 0.5; }
        67% { opacity: 1; }
        100% { opacity: 0.5; }
    }

    @keyframes loader-fade {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
</style>