<script lang="ts">
    import Spacing from './Spacing'

    export let all: Spacing.Size = Spacing.None
</script>

<div class="space-within" style="--sp-local: {all};">
    <slot></slot>
</div>

<style>
    .space-within {
        padding: var(--sp-local);
    }
</style>