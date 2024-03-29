<script lang="ts" context="module">
    import * as sorters from '$lib/shared/notes/sort'
    const sorter = {
        'updated-des': sorters.updateDate(sorters.descending),
        'updated-asc': sorters.updateDate(sorters.ascending),
        'alpha-des': sorters.alphabetical(sorters.descending),
        'alpha-asc': sorters.alphabetical(sorters.ascending),
    }
</script>

<script lang="ts">
    import type { Tag } from '$lib/shared/tags/types'
    import type { Note, WithTags } from '$lib/shared/notes/types'
    import TagFilter from '$lib/client/tags/components/TagFilter.svelte'
    import TagList from '$lib/client/tags/components/TagList.svelte'
    import Button from '$lib/client/design/atom/Button.svelte'
    import Spacing from '$lib/client/design/quark/Spacing'
    import Skin from '$lib/client/design/quark/Skin'
    import Sheathed from '$lib/client/design/molecule/Sheathed.svelte'
    import Elevation from '$lib/client/design/quark/Elevation'
    import Font from '$lib/client/design/quark/Font'
    import ToggleableTag from '$lib/client/tags/components/ToggleableTag.svelte'
    import Column from '$lib/client/design/atom/Column.svelte'
    import { containingAllTags, textInTitle } from '$lib/shared/notes/filter'
    import { createEventDispatcher } from 'svelte'
    import ClearableFilter from '$lib/client/design/molecule/ClearableFilter.svelte'
    import Select from '$lib/client/design/atom/Select.svelte'
    import * as Arrow from '$lib/client/design/icon/Arrow'

    import List from './List.svelte'

    const dispatch = createEventDispatcher()

    export let allNotes: (Note & WithTags)[]
    export let allTags: Tag[]

    let filteredTags: Tag[] = []
    let activeTags: Tag[] = []
    let filterByTitleText = ''
    let noteSorter = sorter['updated-des']

    $: filteredNotes = allNotes
        .filter(textInTitle(filterByTitleText))
        .filter(containingAllTags(activeTags))
        .sort(noteSorter)

    const toggleTag = (tag: Tag) => () => {
        if (activeTags.includes(tag))
            activeTags = activeTags.filter(it => it.id !== tag.id)
        else
            activeTags = [...activeTags, tag]
    }

    const createNew = () => {
        dispatch('createnewnote')
    }

    const onSortSelection = (event: Event) => {
        noteSorter = sorter[(event.target as HTMLSelectElement).value]
    }

    let sheathExpanded = false
    const unsheathFilter = () => sheathExpanded = true
    const resheathFilter = () => sheathExpanded = false
</script>

<div class="content-area">
    <section class="notes">
        <div class="notes-header">
            <h2>Notes</h2>
            <Select id="notes-sorter" label="Sort" size={Font.Size.Mars} on:change={onSortSelection}>
                <option selected value="updated-des">Newest</option>
                <option value="updated-asc">Oldest</option>
                <option value="alpha-asc">A to Z</option>
                <option value="alpha-des">Z to A</option>
            </Select>
            <Button size={Font.Size.Mars} spacing={Spacing.Static.Carbon} color={Skin.Disgust} on:click={createNew}>Create New Note</Button>
        </div>
        <List items={filteredNotes} activeTags={activeTags} on:createnewnote={createNew} />
    </section>
    <Sheathed bind:expanded={sheathExpanded}>
        <aside class="filtering">
            <h2>Filtering</h2>
            <div class="filtering-sheath-button">
                <Button label="Dismiss filtering options" on:click={resheathFilter} spacing={Spacing.Static.Oxygen} color={Skin.Joy}><Arrow.Down /></Button>
            </div>
            <Column>
                <ClearableFilter id="filter-by-title" label="Filter by Title" bind:value={filterByTitleText} />
                <TagFilter tags={allTags} bind:filtered={filteredTags} />
                <TagList tags={filteredTags} font={Font.Size.Venus} let:tag>
                    <ToggleableTag {tag} on:click={toggleTag(tag)} active={activeTags.find(it => it.id === tag.id) !== undefined} />
                </TagList>
            </Column>
        </aside>
        <Button slot="activator" on:click={unsheathFilter} elevation={Elevation.Cumulus}>Filter</Button>
    </Sheathed>
</div>

<style lang="scss">
    .content-area {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--sp-dy-c);
        padding: 0 var(--sp-dy-c);

        h2 {
            font-size: var(--font-sz-neptune);
            font-weight: var(--font-wt-b);
            margin-bottom: var(--sp-st-be);
        }
    }

    .notes-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;

        h2 {
            flex: 1;
        }

        & > :global(*:not(:first-child)) {
            margin-left: var(--sp-st-he);
        }
    }

    .filtering {
        position: relative;

        .filtering-sheath-button {
            position: absolute;
            top: 0;
            right: 0;
        }
    }

    @media screen and (min-width: 50rem) {
        .content-area {
            grid-template-columns: 2fr 1fr;
        }

        .filtering-sheath-button {
            display: none;
        }
    }
</style>