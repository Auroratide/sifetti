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
    import Spacing from '../../design/Spacing'
    import TagFilter from '../../tags/components/TagFilter.svelte'
    import TagList from '../../tags/components/TagList.svelte'
    import Button from '../../design/Button.svelte'
    import Font from '../../design/Font'

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
    <div class="filter-container">
        <TagFilter id="edit-tags" tags={allTags} bind:filtered={filteredTags} bind:filterName={filterName}>
            <Button slot="action" size={Font.Size.Venus} disabled={!canCreate} on:click={createTag}>Add as New Tag</Button>
        </TagFilter>
    </div>
    <TagList tags={filteredTags} let:tag>
        <Button spacing={Spacing.Static.Oxygen} on:click={click(tag)}>
            <span class="tag-button-content">
                <span class="tag-name">{tag.name}</span>
                <span class="tag-added" class:visible={noteTagIds.includes(tag.id)}>✔</span>
            </span>
        </Button>
    </TagList>
</div>

<style lang="scss">
    @import '../../design/mixins.scss';

    .filter-container {
        margin-bottom: var(--sp-dy-c);
    }

    .tag-button-content {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .tag-added {
        font-size: var(--font-sz-venus);
        position: relative;
        left: var(--sp-st-be);
        visibility: hidden;
        color: var(--skin-sad);
        background-color: var(--skin-sad-text);

        @include fettibox(var(--sp-st-h), var(--sp-st-be), var(--skin-sad-text));
    }

    .tag-added.visible {
        visibility: visible;
    }
</style>