<script lang="ts">
    import Spacing from './Spacing'

    export let center: boolean = false
    export let gap: Spacing.Size = Spacing.Dynamic.Carbon
</script>

<div class="column" class:center style="--gap: {gap};">
    <slot></slot>
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }

    .column > :global(*:not(:last-child)) {
        margin-bottom: var(--gap);
    }

    .center {
        align-items: center;
        justify-content: center;
    }
</style>