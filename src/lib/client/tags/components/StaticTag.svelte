<script lang="ts">
    import Skin from '$lib/client/design/quark/Skin'
    import { FettiboxCorners } from '$lib/client/design/atom/Fettibox.svelte'
    import { generator } from '$lib/client/design/random/context'

    export let color: Skin.Scheme = Skin.Sad
    const corners = FettiboxCorners.random(generator(), 0.25)
</script>

<span class="tag" style="--skin-local: {color}; --skin-local-text: {color.Text}; {corners.style};"><slot></slot></span>

<style lang="scss">
    @import '../../design/mixins.scss';

    .tag {
        color: var(--skin-local-text);
        display: inline-block;

        @include fettibox(var(--sp-st-he), var(--sp-st-o), var(--skin-local));
    }
</style>