<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { requiresAuth } from '$lib/client/load/requires-auth'
    import { PeopleApi } from '$lib/client/people/api'

    export const load: Load = requiresAuth(async ({ session, fetch, url }) => {
        return {
            props: {
                people: new PeopleApi(fetch),
                person: session.person,
                problem: url.searchParams.get('problem') ?? undefined,
            },
        }
    })
</script>

<script lang="ts">
    import type { Person } from '$lib/shared/people/types'
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import Container from '$lib/client/design/atom/Container.svelte'
    import TextInput, { TextFieldType } from '$lib/client/design/atom/TextInput.svelte'
    import LinkButton from '$lib/client/design/atom/LinkButton.svelte'
    import FettiForm from '$lib/client/design/molecule/FettiForm.svelte'
    import Column from '$lib/client/design/atom/Column.svelte'
    import Skin from '$lib/client/design/quark/Skin'
    import { toast } from '$lib/client/design/molecule/Toast.svelte'
    import { session } from '$app/stores'

    export let people: PeopleApi
    export let person: Person
    export let problem: string = undefined

    let currentName = person.name
    let attempting = false
    let error = problem
    $: idlecolor = error ? Skin.Anger : Skin.Neutral
    $: focuscolor = error ? Skin.Anger : Skin.Fear

    const submit = async () => {
        try {
            attempting = true
            error = undefined

            if (currentName !== person.name) {
                await people.rename(currentName)
            }

            attempting = false
            toast.success('Changes made successfully!')

            const updatedPerson = await people.myInfo()
            $session.person = updatedPerson
        } catch(err) {
            attempting = false
            error = err?.message ?? 'Something went wrong... please try again later'
        }
    }
</script>

<Navigation />
<main>
    <Container small>
        <FettiForm on:submit={submit} title="Manage your Profile" submit="Submit Changes" action="/forms/me/manage" {attempting} {error}>
            <TextInput id="name" type={TextFieldType.Text} bind:value={currentName} name="name" label="Name" placeholder="Enter Name" {idlecolor} {focuscolor} />
        </FettiForm>
        <Column center>
            <LinkButton href="/me">Back to My Page</LinkButton>
        </Column>
    </Container>
</main>

<style lang="scss">
    main {
        padding: var(--sp-dy-mg);
        background-color: var(--skin-bg);
    }
</style>