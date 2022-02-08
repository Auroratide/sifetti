<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/notes/api'
    import { TagsApi } from '$lib/tags/api'
    import { requiresAuth } from '$lib/routing/requires-auth'

    export const load: Load = requiresAuth(async ({ session, fetch }) => {
        return {
            props: {
                person: session.person,
                notes: new NotesApi(fetch),
                tags: new TagsApi(fetch),
            },
        }
    })
</script>

<script lang="ts">
    import type { Person } from '$lib/people/types'
    import type { Tag } from '$lib/tags/types'
    import type { Note, WithTags } from '$lib/notes/types'
    import { goto } from '$app/navigation'
    import Title from '$lib/design/Title.svelte'
    import Fettibox, { FettiboxCorners } from '$lib/design/Fettibox.svelte'
    import Spacing from '$lib/design/Spacing'
    import Skin from '$lib/design/Skin'
    import Navigation from '$lib/design/Navigation.svelte'
    import { onMount } from 'svelte'
    import Loader from '$lib/design/Loader.svelte'
    import { generator } from '$lib/design/random/context'
    import NotesView from '$lib/notes/components/NotesView'

    export let person: Person
    export let notes: NotesApi
    export let tags: TagsApi

    const headerCorners = FettiboxCorners.random(generator()).override({
        tl: 0,
        tr: 0,
        bl: 0,
        br: 0,
    })

    let loading = true

    let allNotes: (Note & WithTags)[] = []
    let allTags: Tag[] = []

    onMount(() => {
        Promise.all([
            notes.getAll(),
            tags.getAll(),
        ]).then(([ notes, tags ]) => {
            allNotes = notes
            allTags = tags
            loading = false
        })
    })

    const createNew = () => {
        return notes.create().then(ids => goto(ids.view))
    }
</script>

<Navigation color={Skin.Neutral} />
<main>
    <header>
        <Fettibox center spacing={Spacing.Dynamic.Oxygen} corners={headerCorners}>
            <Title color={Skin.Fear.Text} value="My Profile">{person.email}</Title>        
        </Fettibox>
    </header>
    {#if loading}
        <div class="loader">
            <Loader />
        </div>
    {:else}
        <NotesView {allNotes} {allTags} on:createnewnote={createNew} />
    {/if}
</main>

<style lang="scss">
    header {
        margin-bottom: var(--sp-dy-o);
    }

    .loader {
        min-height: 75vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>