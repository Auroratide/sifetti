<script lang="ts">
    import type Skin from '../quark/Skin'
    import type Font from '../quark/Font'

    export let value: string
    export let color: Skin.Color = ''
    export let size: Font.Size = ''

    $: title = value ? `${value} - Sifetti` : 'Sifetti'
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<h1 style="color: {color}; font-size: {size};">
    <slot>{value}</slot>
</h1>
