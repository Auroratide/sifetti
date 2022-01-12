<script lang="ts">
    import type { Tag } from '../types'
    import TextInput, { TextFieldType } from '../../design/TextInput.svelte'

    export let id: string = 'tag-filter'
    export let tags: Tag[]
    export let filtered: Tag[]

    let input: string = ''
    $: filtered = tags.filter(it => it.name.startsWith(input))
</script>

<TextInput {id} label="Filter Tags" name={id} type={TextFieldType.Text} bind:value={input} />
