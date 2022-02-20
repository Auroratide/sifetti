<script lang="ts">
    import TextInput, { TextFieldType } from '../atom/TextInput.svelte'
    import Button from '../atom/Button.svelte'
    import Font from '../quark/Font'

    export let id: string
    export let label: string
    export let value: string
    export let disabled: boolean = false

    const clear = () => value = ''
</script>

<TextInput {id} {label} name="" type={TextFieldType.Text} bind:value={value} {disabled}>
    <Button slot="action" on:click={clear} size={Font.Size.Mars}>Clear</Button>
</TextInput>
