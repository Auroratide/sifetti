<script lang="ts" context="module">
    export type CreateTagEventPayload = {
        name: string,
    }
    
    export type TagEventPayload = {
        tag: Tag,
    }
</script>

<script lang="ts">
    import type { Tag } from '../../tags/types'
    import { createEventDispatcher } from 'svelte'
    import TagFilter from '../../tags/components/TagFilter.svelte'
    import TagList from '../../tags/components/TagList.svelte'
    import Button from '../../design/Button.svelte'

    const dispatch = createEventDispatcher()

    export let allTags: Tag[]
    export let noteTags: Tag[]
    $: noteTagIds = noteTags.map(it => it.id)

    let filteredTags: Tag[] = []
    let filterName: string = ''

    $: canCreate = filterName.length > 0 && !filteredTags.map(it => it.name).includes(filterName)

    const click = (tag: Tag) => () => {
        if (noteTagIds.includes(tag.id)) {
            dispatch('removetag', { tag })
        } else {
            dispatch('addtag', { tag })
        }
    }

    const createTag = () => {
        dispatch('createtag', {
            name: filterName,
        })
    }
</script>

<div class="edit-tags">
    <TagFilter id="edit-tags" tags={allTags} bind:filtered={filteredTags} bind:filterName={filterName} />
    <TagList tags={filteredTags} let:tag>
        <Button on:click={click(tag)}>{tag.name}</Button>
    </TagList>
    <Button disabled={!canCreate} on:click={createTag}>Add as New Tag</Button>
</div>