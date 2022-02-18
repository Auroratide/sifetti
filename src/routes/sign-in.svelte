<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { PeopleApi, PeopleApiErrorType } from '$lib/people/api'

    export const load: Load = async ({ url, fetch }) => {
        const rawDestination = url.searchParams.get('from')

        return {
            props: {
                people: new PeopleApi(fetch),
                destination: rawDestination ? decodeURIComponent(rawDestination) : undefined,
                initialError: url.searchParams.get('status') ?? undefined,
            },
        }
    }
</script>

<script lang="ts">
    import { session } from '$app/stores'
    import { goto } from '$app/navigation'
    import TextInput, { TextFieldType } from '$lib/design/atom/TextInput.svelte'
    import Container from '$lib/design/atom/Container.svelte'
    import Skin from '$lib/design/quark/Skin'

    import FettiForm from '$lib/design/molecule/FettiForm.svelte'

    const errorMessage = (err) => {
        if (err === undefined) {
            return undefined
        } else if (err === PeopleApiErrorType.BadCredentials) {
            return 'Hmm... email or password is incorrect'
        } else {
            return 'Something went wrong... please try again later'
        }
    }

    export let people: PeopleApi
    export let destination: string = '/me'
    export let initialError: string = undefined

    let email = ''
    let password = ''
    let error = errorMessage(initialError)
    let attempting = false

    $: idlecolor = error ? Skin.Anger : Skin.Neutral
    $: focuscolor = error ? Skin.Anger : Skin.Fear

    const submit = async () => {
        try {
            attempting = true
            error = undefined
            const person = await people.signIn(email, password)
            $session.person = person

            return goto(destination)
        } catch(err) {
            attempting = false
            error = errorMessage(err?.message ?? 'unknown')
        }
    }
</script>

<main>
    <Container small>
        <FettiForm on:submit={submit} title="Sign in to Sifetti" action={PeopleApi.SIGN_IN} submit="Sign In!" {attempting} {error}>
            <input type="hidden" name="destination" bind:value={destination} />
            <TextInput id="email" required type={TextFieldType.Email} name="email" label="Email" placeholder="Enter Email" bind:value={email} {idlecolor} {focuscolor} />
            <TextInput id="password" required type={TextFieldType.Password} name="password" label="Password" placeholder="Enter Password" bind:value={password} {idlecolor} {focuscolor} />
        </FettiForm>
    </Container>
</main>

<style lang="scss">
    main {
        padding: var(--sp-dy-mg);
        background-color: var(--skin-bg);
    }
</style>