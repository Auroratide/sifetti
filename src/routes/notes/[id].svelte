<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'

    export const load: Load = async ({ page, fetch }) => {
        const api = new NotesApi(fetch)
        const note = await api.getById(page.params.id)

        return {
            props: {
                api,
                note,
            }
        }
    }
</script>

<script lang="ts">
    import type { Note } from '$lib/notes/types'

    export let api: NotesApi
    export let note: Note

    let currentTitle: string = note.title
    let currentContent: string = note.content

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
</script>

<div class="background">
    <div class="container">
        <article class="note" aria-label="{currentTitle}">
            <div class="input title">
                <label for="title-input">Title</label>
                <input id="title-input" type="text" placeholder="Untitled" bind:value={currentTitle} />
            </div>
            <div class="input content">
                <label for="content-input">Content</label>
                <textarea id="content-input" bind:value={currentContent}></textarea>
            </div>
            <button on:click={save}>Save</button>
            <a href="/me">Back</a>
        </article>
    </div>
</div>

<style lang="scss">
    .background {
        background-color: #f7f7ff;
        padding: 2rem;
    }

    .container {
        --angle: 0.5em;
        background-color: hsl(210, 68%, 45%);
        padding: 1rem;
        clip-path: polygon(var(--angle) var(--angle), 100% 0%, calc(100% - var(--angle)) calc(100% - var(--angle)), 0% 100%);
    }

    .note {
        background-color: #ffffff;
        padding: 1rem;
    }

    .title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .content {
        height: 10rem;
        margin-bottom: 1rem;
        
        textarea {
            height: 100%;
        }
    }

    .input {
        display: grid;
        grid-template: 1fr / 1fr;
        align-items: start;

        label {
            --angle: 0.1em;
            grid-column: 1;
            grid-row: 1;
            justify-self: start;
            background-color: hsl(210, 68%, 45%);
            color: white;
            font-size: 0.75em;
            padding: 0 0.5em;
            line-height: 1;
            clip-path: polygon(var(--angle) var(--angle), 100% 0%, calc(100% - var(--angle)) calc(100% - var(--angle)), 0% 100%);
            transform: translate(0.75em, -0.5em);
        }

        input, textarea {
            grid-column: 1;
            grid-row: 1;
        }
    }
</style>