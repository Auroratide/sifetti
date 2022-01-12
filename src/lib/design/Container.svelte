<script lang="ts">
    export let small: boolean = false
</script>

<div class="container" class:small>
    <slot></slot>
</div>

<style>
    .container {
        max-width: 75rem;
        margin: auto;
    }

    .container.small {
        max-width: 35rem;
    }
</style>