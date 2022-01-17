<script lang="ts">
    import Skin from '../../design/Skin'
    import { FettiboxCorners } from '../../design/Fettibox.svelte'

    export let color: Skin.Scheme = Skin.Sad
    const corners = FettiboxCorners.random(0.25)
</script>

<span class="tag" style="--color: {color}; --color-text: {color.Text}; {corners.style};"><slot></slot></span>

<style lang="scss">
    @import '../../design/mixins.scss';

    .tag {
        --pad-tb: var(--sp-st-he);
        --pad-lr: var(--sp-st-o);
        color: var(--color-text);

        @include fettibox;
    }
</style>