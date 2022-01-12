<script lang="ts">
    export let center: boolean = false
</script>

<div class="column" class:center>
    <slot></slot>
</div>

<style>
    .column {
        display: flex;
        flex-direction: column;
    }

    .center {
        align-items: center;
        justify-content: center;
    }
</style>