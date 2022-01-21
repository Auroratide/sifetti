<script lang="ts">
    import type { Tag } from '../types'
    import TextInput, { TextFieldType } from '../../design/TextInput.svelte'
    import type Skin from '../../design/Skin'

    export let id: string = 'tag-filter'
    export let tags: Tag[]
    export let filtered: Tag[] = []
    export let filterName: string = ''
    export let idlecolor: Skin.Scheme = undefined
    export let disabled: boolean = false

    $: filtered = tags.filter(it => it.name.startsWith(filterName))
</script>

<TextInput {id} {idlecolor} label="Filter Tags" name={id} type={TextFieldType.Text} bind:value={filterName} {disabled}>
    <slot slot="action" name="action"></slot>
</TextInput>
