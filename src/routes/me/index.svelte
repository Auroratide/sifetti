<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { NotesApi } from '$lib/client/notes/api'
    import { TagsApi } from '$lib/client/tags/api'
    import { requiresAuth } from '$lib/client/load/requires-auth'

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
    import type { Person } from '$lib/shared/people/types'
    import type { Tag } from '$lib/shared/tags/types'
    import type { Note, WithTags } from '$lib/shared/notes/types'
    import { goto } from '$app/navigation'
    import Title from '$lib/client/design/atom/Title.svelte'
    import Fettibox, { FettiboxCorners } from '$lib/client/design/atom/Fettibox.svelte'
    import Spacing from '$lib/client/design/quark/Spacing'
    import Skin from '$lib/client/design/quark/Skin'
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import { onMount } from 'svelte'
    import Loader from '$lib/client/design/molecule/Loader.svelte'
    import { generator } from '$lib/client/design/random/context'
    import NotesView from '$lib/client/notes/components/NotesView'
    import { linkto } from '$lib/client/linkto'

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

    const noteLink = linkto().note
    const createNew = async () => {
        return notes.create().then(ids => goto(noteLink(ids.id)))
    }
</script>

<Navigation color={Skin.Neutral} />
<main>
    <header>
        <Fettibox center spacing={Spacing.Dynamic.Oxygen} corners={headerCorners}>
            <Title color={Skin.Fear.Text} value="My Profile">{person.name ?? person.email}</Title>        
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
        word-break: break-all;
        text-align: center;
    }

    .loader {
        min-height: 75vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>