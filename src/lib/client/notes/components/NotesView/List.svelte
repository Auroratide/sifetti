<script lang="ts">
    import type { Note, WithTags } from '$lib/shared/notes/types'
    import type { Tag } from '$lib/shared/tags/types'
    import Fetticard from '$lib/client/design/molecule/Fetticard.svelte'
    import TagList from '$lib/client/tags/components/TagList.svelte'
    import Button from '$lib/client/design/atom/Button.svelte'
    import Spacing from '$lib/client/design/quark/Spacing'
    import Font from '$lib/client/design/quark/Font'
    import Skin from '$lib/client/design/quark/Skin'
    import { linkto } from '$lib/client/linkto'

    import { createEventDispatcher } from 'svelte'

    const dispatch = createEventDispatcher()

    export let items: (Note & WithTags)[]
    export let activeTags: Tag[]

    const createNew = () => {
        dispatch('createnewnote')
    }
</script>

<ul class="list">
    {#each items as item}
        <li><Fetticard label={item.title}>
            <section class="card-content">
                <a href={linkto().note(item.id)}>{item.title.length > 0 ? item.title : 'Untitled Note'}</a>
                {#if item.tags?.length > 0}
                    <div class="tags">
                        <TagList spacing={Spacing.Static.Hydrogen} tags={item.tags} let:tag>
                            <span class="tag" class:active={activeTags.find(it => it.id === tag.id) !== undefined}>{tag.name}</span>
                        </TagList>
                    </div>
                {/if}
            </section>
        </Fetticard></li>
    {/each}
    <li class="create-new"><Button size={Font.Size.Venus} spacing={Spacing.Static.Magnesium} color={Skin.Disgust} on:click={createNew}>Create New Note</Button></li>
</ul>

<style lang="scss">
    .list {
        list-style: none;
        padding: 0;
        display: grid;
        grid-gap: var(--sp-dy-be);
        grid-template-columns: repeat(auto-fill, minmax(min(20rem, 100%), 1fr));

        .create-new {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .card-content {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: var(--sp-st-he);

        a {
            text-decoration: none;
            color: var(--skin-content-text);
        }

        .tags {
            font-size: var(--font-sz-mars);
            color: var(--skin-sad);
            margin: 0 calc(-1 * var(--sp-st-he));

            .tag {
                display: inline-block;
                margin: 0 var(--sp-st-he);

                &.active {
                    font-weight: var(--font-wt-b);
                }
            }
        }
    }
</style>