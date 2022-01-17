<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'
    import { TagsApi } from '$lib/tags/api'
    import { parser } from '$lib/rendering/markdown'

    export const load: Load = async ({ page, fetch }) => {
        const api = new NotesApi(fetch)
        const tagsApi = new TagsApi(fetch)
        const note = await api.getById(page.params.id)
        const tags = await api.getTags(page.params.id)
        const allTags = await tagsApi.getAll()
        const parse = await parser()

        return {
            props: {
                api,
                note,
                tags,
                allTags,
                parse,
                tagsApi,
            }
        }
    }
</script>

<script lang="ts">
    import type { Note } from '$lib/notes/types'
    import type { Tag } from '$lib/tags/types'
    import type { Parser } from '$lib/rendering/markdown'
    import EditableTitle from '$lib/notes/components/EditableTitle.svelte'
    import EditableContent from '$lib/notes/components/EditableContent.svelte'
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Container from '$lib/design/Container.svelte'
    import Content from '$lib/design/Content.svelte'
    import TagList from '$lib/tags/components/TagList.svelte'
    import TagFilter from '$lib/tags/components/TagFilter.svelte'
    import EditTags from '$lib/notes/components/EditTags.svelte'
    import type { TagEventPayload, CreateTagEventPayload } from '$lib/notes/components/EditTags.svelte'
    import { tick } from 'svelte'
    import Spacing from '$lib/design/Spacing'
    import Button from '$lib/design/Button.svelte'
    import Skin from '$lib/design/Skin'

    export let api: NotesApi
    export let note: Note
    export let tags: Tag[]
    export let parse: Parser
    export let allTags: Tag[]
    export let tagsApi: TagsApi

    let currentTitle: string = note.title
    let currentContent: string = note.content
    let parsed = parse(currentContent)

    let editMode = false

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

    const addTag = (e: CustomEvent<TagEventPayload>) => {
        api.addTag(note.id, e.detail.tag.id).then(() => {
            return api.getTags(note.id)
        }).then(res => {
            tags = res
        }).catch(err => {
            alert(err.message)
        })
    }

    const removeTag = (e: CustomEvent<TagEventPayload>) => {
        api.removeTag(note.id, e.detail.tag.id).then(() => {
            return api.getTags(note.id)
        }).then(res => {
            tags = res
        }).catch(err => {
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

<main>
    <Container>
        <Fettibox spacing={Spacing.Zeroing.Oxygen} unclippedSpace={Spacing.Static.Helium}>
            <article class="note" aria-label="{currentTitle}">
                <EditableTitle id="title-input" bind:value={currentTitle} on:finishedit={save} />
                <section class="tags">
                    <TagList {tags} />
                </section>
                <section class="add-tag">
                    <strong>Add Tag?</strong>
                    <EditTags allTags={allTags} noteTags={tags} on:addtag={addTag} on:removetag={removeTag} on:createtag={createTag} />
                </section>
                <section class="content">
                    <EditableContent id="content-input" bind:editing={editMode} bind:value={currentContent} on:finishedit={stopEditing}>
                        {@html parsed}
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

    .tags {
        font-size: var(--font-sz-venus);
    }

    .add-tag {
        display: none;
    }
</style>