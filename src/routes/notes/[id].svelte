<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'
    import { parser } from '$lib/rendering/markdown'

    export const load: Load = async ({ page, fetch }) => {
        const api = new NotesApi(fetch)
        const note = await api.getById(page.params.id)
        const tags = await api.getTags(page.params.id)
        const parse = await parser()

        return {
            props: {
                api,
                note,
                tags,
                parse,
            }
        }
    }
</script>

<script lang="ts">
    import type { Note } from '$lib/notes/types'
    import type { Tag } from '$lib/tags/types'
    import type { Parser } from '$lib/rendering/markdown'
    import Title from '$lib/design/Title.svelte'
    import EditableTitle from '$lib/notes/components/EditableTitle.svelte'
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Container from '$lib/design/Container.svelte'
    import Content from '$lib/design/Content.svelte'
    import TextInput, { TextFieldType } from '$lib/design/TextInput.svelte'
    import { tick } from 'svelte'

    export let api: NotesApi
    export let note: Note
    export let tags: Tag[]
    export let parse: Parser

    let textarea: HTMLElement

    let currentTitle: string = note.title
    let currentContent: string = note.content
    let parsed = parse(currentContent)

    let editMode = false

    const save = () => {
        return api.edit(note.id, {
            title: currentTitle,
            content: currentContent
        }).then(() => {
            alert('Saved!')
        }).catch(err => {
            alert(err)
        })
    }

    const edit = async () => {
        editMode = true
        await tick()
        textarea.focus()
    }

    const stopEditing = () => {
        editMode = false
        parsed = parse(currentContent)
    }
</script>

<main>
    <Container>
        <Fettibox>
            <article class="note" aria-label="{currentTitle}">
                <EditableTitle id="title-input" bind:value={currentTitle} />
                <section class="tags">
                    <strong>Tags</strong>
                    <ul>
                        {#each tags as tag}
                            <li>{tag.name}</li>
                        {/each}
                    </ul>
                </section>
                <Content>
                    {#if editMode}
                        <div class="input">
                            <label for="content-input">Content</label>
                            <textarea bind:this={textarea} on:blur={stopEditing} id="content-input" bind:value={currentContent}></textarea>
                        </div>
                    {:else}
                        {@html parsed}
                    {/if}
                </Content>
                <button on:click={save}>Save</button>
                <button on:click={edit}>Edit</button>
                <a href="/me">Back</a>
            </article>
        </Fettibox>
    </Container>
</main>

<style lang="scss">
    main {
        padding: clamp(1rem, 2vw, 2rem);
    }

    .note {
        background-color: #ffffff;
        padding: 1rem;
    }

    textarea {
        min-height: 10rem;
    }
</style>