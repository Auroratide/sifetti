<script lang="ts" context="module">
    export type CreateTagEventPayload = {
        name: TagName,
    }
    
    export type TagEventPayload = {
        tag: Tag,
    }
</script>

<script lang="ts">
    import type { Tag } from '$lib/shared/tags/types'
    import { TagName } from '$lib/shared/tags/types/tag-name'
    import { createEventDispatcher } from 'svelte'
    import TagFilter from '$lib/client/tags/components/TagFilter.svelte'
    import TagList from '$lib/client/tags/components/TagList.svelte'
    import Button from '$lib/client/design/atom/Button.svelte'
    import Font from '$lib/client/design/quark/Font'
    import Skin from '$lib/client/design/quark/Skin'
    import Loader from '$lib/client/design/molecule/Loader.svelte'
    import ToggleableTag from '$lib/client/tags/components/ToggleableTag.svelte'

    const dispatch = createEventDispatcher()

    export let allTags: Tag[]
    export let noteTags: Tag[]
    export let processing: boolean = false
    $: noteTagIds = noteTags.map(it => it.id)

    let filteredTags: Tag[] = []
    let filterName: string = ''

    $: canCreate = filterName.length > 0
        && TagName.is(filterName)
        && !filteredTags.map(it => it.name).includes(filterName)

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
            <div slot="action">
                {#if processing}
                    <div class="loader">
                        <Loader color={Skin.Disgust} size={Font.Size.Mercury} />
                    </div>
                {:else}
                    <Button size={Font.Size.Venus} disabled={!canCreate} on:click={createTag}>New Tag</Button>
                {/if}
                </div>
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