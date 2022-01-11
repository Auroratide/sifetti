<script lang="ts">
    export let value: string

    $: title = value ? `${value} - Sifetti` : 'Sifetti'
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1><slot>{value}</slot></h1>
