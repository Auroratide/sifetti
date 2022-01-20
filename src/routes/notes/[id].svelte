<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'
    import { TagsApi } from '$lib/tags/api'
    import { requiresAuth } from '$lib/routing/requires-auth'

    export const load: Load = requiresAuth(async ({ page, fetch }) => {
        const api = new NotesApi(fetch)
        const tagsApi = new TagsApi(fetch)

        return {
            props: {
                noteId: page.params.id,
                api,
                tagsApi,
                shouldRefresh: true,
            }
        }
    })
</script>

<script lang="ts">
    import type { Note, Id } from '$lib/notes/types'
    import type { Tag } from '$lib/tags/types'
    import { onMount } from 'svelte'
    import EditableTitle from '$lib/notes/components/EditableTitle.svelte'
    import EditableContent from '$lib/notes/components/EditableContent.svelte'
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Container from '$lib/design/Container.svelte'
    import Content from '$lib/design/Content.svelte'
    import TagList from '$lib/tags/components/TagList.svelte'
    import EditTags from '$lib/notes/components/EditTags.svelte'
    import type { TagEventPayload, CreateTagEventPayload } from '$lib/notes/components/EditTags.svelte'
    import Spacing from '$lib/design/Spacing'
    import Button from '$lib/design/Button.svelte'
    import Skin from '$lib/design/Skin'
    import Font from '$lib/design/Font'
    import { parse } from '$lib/rendering/markdown'
    import Loader from '$lib/design/Loader.svelte'
    import Navigation from '$lib/design/Navigation.svelte'
    import Column from '$lib/design/Column.svelte'

    export let noteId: Id
    export let api: NotesApi
    export let tagsApi: TagsApi
    export let shouldRefresh: boolean

    let loading = true
    let note: Note = null
    let currentTitle: string = ''
    let currentContent: string = ''
    let parsed: string = ''
    let tags: Tag[] = []
    let allTags: Tag[] = []

    const refresh = () => {
        loading = true

        return Promise.all([
            api.getById(noteId),
            api.getTags(noteId),
            tagsApi.getAll(),
        ]).then(([ noteRes, tagsRes, allTagsRes ]) => {
            loading = false

            note = noteRes
            currentTitle = note.title
            currentContent = note.content
            parsed = parse(currentContent)

            tags = tagsRes
            allTags = allTagsRes
        })
    }

    $: {
        if (shouldRefresh && !loading) {
            shouldRefresh = false
            refresh()
        }
    }

    onMount(() => {
        shouldRefresh = false
        refresh()
    })

    let editMode = false
    let editingTags = false

    const save = () => api.edit(note.id, {
        title: currentTitle,
        content: currentContent
    }).catch(err => {
        alert(err)
    })

    const edit = () => editMode = true

    const stopEditing = () => {
        parsed = parse(currentContent)
        return save()
    }

    const startEditingTags = () => editingTags = true
    const stopEditingTags = () => editingTags = false

    const addTag = (e: CustomEvent<TagEventPayload>) => {
        tags = [...tags, e.detail.tag]
        api.addTag(note.id, e.detail.tag.id).catch(err => {
            alert(err.message)
        })
    }

    const removeTag = (e: CustomEvent<TagEventPayload>) => {
        tags = tags.filter(it => it.id !== e.detail.tag.id)
        api.removeTag(note.id, e.detail.tag.id).catch(err => {
            alert(err.message)
        })
    }

    const createTag = (e: CustomEvent<CreateTagEventPayload>) => {
        tagsApi.create(e.detail.name).then((id) => {
            return api.addTag(note.id, id)
        }).then(() => {
            return api.getTags(note.id)
        }).then(res => {
            tags = res
            return tagsApi.getAll()
        }).then(res => {
            allTags = res
        }).catch(err => {
            alert(err.message)
        })
    }
</script>

<Navigation />
<main>
    <Container>
        <Fettibox spacing={Spacing.Zeroing.Oxygen} unclippedSpace={Spacing.Static.Helium}>
            <article class="note" aria-label="{currentTitle}">
                {#if loading}
                    <div class="loader">
                        <Loader />
                    </div>
                {:else}
                    <EditableTitle id="title-input" bind:value={currentTitle} on:finishedit={save} />
                    <section class="tags">
                        <TagList {tags} />
                        <span class="add-remove-button"><Button label="Add or remove tags" on:click={startEditingTags} color={Skin.Joy} size={Font.Size.Neptune} spacing={Spacing.Static.Carbon}>+</Button></span>
                    </section>
                    {#if editingTags}
                        <section class="add-tag">
                            <Fettibox color={Skin.Neutral} spacing={Spacing.Dynamic.Berylium}>
                                <strong class="title-text">Add or Remove Tags</strong>
                                <EditTags allTags={allTags} noteTags={tags} on:addtag={addTag} on:removetag={removeTag} on:createtag={createTag} />
                                <div class="dismiss-tagging">
                                    <Button label="Dismiss tagging options" on:click={stopEditingTags} color={Skin.Joy} spacing={Spacing.Static.Oxygen}>^</Button>
                                </div>
                            </Fettibox>
                        </section>
                    {/if}
                    <section class="content">
                        <EditableContent id="content-input" bind:editing={editMode} bind:value={currentContent} on:finishedit={stopEditing}>
                            {#if parsed.length > 0}
                                <Content>
                                    {@html parsed}
                                </Content>
                            {:else}
                                <div class="when-empty">
                                    <p>Double tap to edit</p>
                                </div>
                            {/if}
                        </EditableContent>
                    </section>
                    <section class="editing-options">
                        {#if editMode}
                            <Button color={Skin.Disgust} on:click={save}>Save</Button>
                        {:else}
                            <Button on:click={edit}>Edit</Button>
                        {/if}
                    </section>
                    <a href="/me">Back</a>
                {/if}
            </article>
        </Fettibox>
    </Container>
</main>

<style lang="scss">
    main {
        padding: var(--sp-ze-o);
    }

    .note {
        background-color: var(--skin-content);
        padding: var(--sp-dy-c);
    }

    .loader {
        min-height: 75vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tags {
        font-size: var(--font-sz-venus);
        display: flex;
        align-items: center;
        margin-bottom: var(--sp-dy-c);

        .add-remove-button {
            display: inline-block;
            align-self: flex-end;
            margin-left: var(--sp-st-be);
            margin-bottom: var(--sp-st-he);
        }
    }

    .add-tag {
        position: relative;
        margin-bottom: var(--sp-dy-c);

        .title-text {
            display: block;
            font-size: var(--font-sz-uranus);
            margin-bottom: var(--sp-st-c);
        }

        .dismiss-tagging {
            position: absolute;
            top: var(--sp-dy-be);
            right: var(--sp-dy-be);
        }
    }

    .when-empty {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        height: 100%;
        color: var(--skin-content-text);

        p {
            font-size: var(--font-sz-neptune);
            margin: 0;
            padding: 9.27% 15%;
            border: var(--sp-st-h) dashed var(--skin-content-text);
            opacity: 0.55;
            user-select: none;
        }
    }
</style>