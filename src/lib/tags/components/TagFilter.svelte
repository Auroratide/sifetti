<script lang="ts">
    import type { Tag } from '../types'
    import TextInput, { TextFieldType } from '../../design/TextInput.svelte'

    export let id: string = 'tag-filter'
    export let tags: Tag[]
    export let filtered: Tag[] = []
    export let filterName: string = ''

    $: filtered = tags.filter(it => it.name.startsWith(filterName))
</script>

<TextInput {id} label="Filter Tags" name={id} type={TextFieldType.Text} bind:value={filterName}>
    <slot slot="action" name="action"></slot>
</TextInput>
