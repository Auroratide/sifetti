<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/client/notes/api'
    import { TagsApi } from '$lib/client/tags/api'
    import { requiresAuth } from '$lib/client/load/requires-auth'

    export const load: Load = requiresAuth(async ({ params, fetch }) => {
        const api = new NotesApi(fetch)
        const tagsApi = new TagsApi(fetch)

        return {
            props: {
                noteId: params.id,
                api,
                tagsApi,
                shouldRefresh: true,
            }
        }
    })
</script>

<script lang="ts">
    import type { Note, Id } from '$lib/shared/notes/types'
    import type { Tag } from '$lib/shared/tags/types'
    import { onMount } from 'svelte'
    import EditableTitle from '$lib/client/notes/components/EditableTitle.svelte'
    import EditableContent from '$lib/client/notes/components/EditableContent.svelte'
    import Fettibox from '$lib/client/design/atom/Fettibox.svelte'
    import Container from '$lib/client/design/atom/Container.svelte'
    import Content from '$lib/client/design/atom/Content.svelte'
    import TagList from '$lib/client/tags/components/TagList.svelte'
    import EditTags from '$lib/client/notes/components/EditTags.svelte'
    import type { TagEventPayload, CreateTagEventPayload } from '$lib/client/notes/components/EditTags.svelte'
    import Spacing from '$lib/client/design/quark/Spacing'
    import Button from '$lib/client/design/atom/Button.svelte'
    import Skin from '$lib/client/design/quark/Skin'
    import { parse } from '$lib/client/rendering/markdown'
    import Loader from '$lib/client/design/molecule/Loader.svelte'
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import FullError from '$lib/client/design/molecule/FullError.svelte'
    import { useOverridingPromise } from '$lib/client/rendering/overriding-promise'
    import { toast } from '$lib/client/design/molecule/Toast.svelte'
    import Elevation from '$lib/client/design/quark/Elevation'

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
    let creatingNewTag = false

    const refresh = async () => {
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
        toast.problem(err.message)
    })

    const edit = () => editMode = true

    const stopEditing = () => {
        editMode = false
        parsed = parse(currentContent)
        return save()
    }

    const toggleEditingTags = () => editingTags = !editingTags
    const stopEditingTags = () => editingTags = false

    const getTags = useOverridingPromise(() => api.getTags(note.id))
        .then(res => tags = res)
    const getAllTags = useOverridingPromise(() => tagsApi.getAll())
        .then(res => allTags = res)

    const addTag = (e: CustomEvent<TagEventPayload>) => {
        tags = [...tags, e.detail.tag]
        const request = getTags.next()
        api.addTag(note.id, e.detail.tag.id).then(() => {
            return request()
        }).catch(err => {
            toast.problem(err.message)
        })
    }

    const removeTag = (e: CustomEvent<TagEventPayload>) => {
        tags = tags.filter(it => it.id !== e.detail.tag.id)
        const request = getTags.next()
        api.removeTag(note.id, e.detail.tag.id).then(() => {
            return request()
        }).catch(err => {
            toast.problem(err.message)
        })
    }

    const createTag = (e: CustomEvent<CreateTagEventPayload>) => {
        creatingNewTag = true
        const getTagsReq = getTags.next()
        const allTagsReq = getAllTags.next()
        tagsApi.create(e.detail.name).then((id) => {
            creatingNewTag = false
            const newTag = {
                id,
                author: null,
                name: e.detail.name,
            }
            tags = [...tags, newTag]
            allTags = [...allTags, newTag]

            return api.addTag(note.id, id)
        }).then(() => {
            return Promise.all([getTagsReq(), allTagsReq()])
        }).catch(err => {
            creatingNewTag = false
            toast.problem(err.message)
        })
    }
</script>

<Navigation />
<main>
    {#if !loading && note == null}
        <div class="full-error-container">
            <FullError title="Note not found" message="Looks like there isn't anything here." />
        </div>
    {:else}
        <Container>
            <Fettibox spacing={Spacing.Zeroing.Oxygen} unclippedSpace={Spacing.Static.Helium} elevation={Elevation.Ground}>
                <article class="note" aria-label="{currentTitle}">
                    {#if loading}
                        <div class="loader">
                            <Loader />
                        </div>
                    {:else}
                        <EditableTitle id="title-input" bind:value={currentTitle} on:finishedit={save} />
                        <section class="tags">
                            <TagList {tags} />
                            <span class="add-remove-button"><Button on:click={toggleEditingTags} color={Skin.Joy} spacing={Spacing.Static.Carbon}>Modify Tags</Button></span>
                        </section>
                        {#if editingTags}
                            <section class="add-tag">
                                <Fettibox color={Skin.Neutral} spacing={Spacing.Dynamic.Berylium}>
                                    <strong class="title-text">Add or Remove Tags</strong>
                                    <EditTags allTags={allTags} noteTags={tags} processing={creatingNewTag} on:addtag={addTag} on:removetag={removeTag} on:createtag={createTag} />
                                    <div class="dismiss-tagging">
                                        <Button label="Dismiss tagging options" on:click={stopEditingTags} color={Skin.Joy} spacing={Spacing.Static.Oxygen}>^</Button>
                                    </div>
                                </Fettibox>
                            </section>
                        {/if}
                        <section class="content">
                            <EditableContent id="content-input" bind:editing={editMode} bind:value={currentContent} on:blur={save}>
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
                                <Button color={Skin.Disgust} on:click={stopEditing}>Save</Button>
                            {:else}
                                <Button on:click={edit}>Edit</Button>
                            {/if}
                        </section>
                    {/if}
                </article>
            </Fettibox>
        </Container>
    {/if}
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
        margin-bottom: var(--sp-dy-c);

        .add-remove-button {
            display: inline;
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

    .full-error-container {
        padding: var(--sp-dy-mg) 0;
    }
</style>