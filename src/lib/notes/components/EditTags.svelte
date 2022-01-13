<script lang="ts" context="module">
    export type TagEventPayload = {
        tag: Tag,
    }
</script>

<script lang="ts">
    import type { Tag } from '../../tags/types'
    import { createEventDispatcher } from 'svelte'
    import TagFilter from '../../tags/components/TagFilter.svelte'

    const dispatch = createEventDispatcher()

    export let allTags: Tag[]
    export let noteTags: Tag[]
    $: noteTagIds = noteTags.map(it => it.id)

    let filteredTags: Tag[] = []

    const click = (tag: Tag) => () => {
        if (noteTagIds.includes(tag.id)) {
            dispatch('removetag', { tag })
        } else {
            dispatch('addtag', { tag })
        }
    }
</script>

<div class="edit-tags">
    <TagFilter id="edit-tags" tags={allTags} bind:filtered={filteredTags} />
    <ul>
        {#each filteredTags as tag}
            <li><button on:click={click(tag)}>{tag.name}</button></li>
        {/each}
    </ul>
</div>