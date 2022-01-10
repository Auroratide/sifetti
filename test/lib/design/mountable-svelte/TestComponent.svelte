<script lang="ts">
    export let text: string
</script>

<p>{text}</p>
<div><slot></slot></div>

<style lang="scss">
    p {
        color: red;
    }

    div {
        color: blue;
    }
</style>
