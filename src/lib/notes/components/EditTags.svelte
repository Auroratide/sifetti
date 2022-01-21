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
    import SpaceWithin from '../../design/SpaceWithin.svelte'
    import Skin from '../../design/Skin'
    import Loader from '../../design/Loader.svelte'
    import ToggleableTag from '../../tags/components/ToggleableTag.svelte'

    const dispatch = createEventDispatcher()

    export let allTags: Tag[]
    export let noteTags: Tag[]
    export let processing: boolean = false
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
        <TagFilter id="edit-tags" tags={allTags} bind:filtered={filteredTags} bind:filterName={filterName} idlecolor={Skin.Sad} disabled={processing}>
            <SpaceWithin slot="action" all={Spacing.Static.Helium}>
                {#if processing}
                    <div class="loader">
                        <Loader color={Skin.Disgust} size={Font.Size.Mercury} />
                    </div>
                {:else}
                    <Button size={Font.Size.Venus} disabled={!canCreate} on:click={createTag}>New Tag</Button>
                {/if}
            </SpaceWithin>
        </TagFilter>
    </div>
    <TagList font={Font.Size.Venus} tags={filteredTags} let:tag>
        <ToggleableTag {tag} on:click={click(tag)} active={noteTagIds.includes(tag.id)} />
    </TagList>
</div>

<style lang="scss">
    @import '../../design/mixins.scss';

    .filter-container {
        margin-bottom: var(--sp-dy-c);
    }

    .loader {
        font-size: var(--font-sz-mars);
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>