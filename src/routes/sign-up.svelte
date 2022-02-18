<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { PeopleApi, PeopleApiErrorType } from '$lib/people/api'

    export const load: Load = async ({ url, fetch }) => {
        return {
            props: {
                people: new PeopleApi(fetch),
                initialError: url.searchParams.get('status') ?? undefined,
            },
        }
    }
</script>

<script lang="ts">
    import { goto } from '$app/navigation'
    import Button from '$lib/design/atom/Button.svelte'
    import TextInput, { TextFieldType } from '$lib/design/atom/TextInput.svelte'
    import Title from '$lib/design/atom/Title.svelte'
    import Fettibox from '$lib/design/atom/Fettibox.svelte'
    import Column from '$lib/design/atom/Column.svelte'
    import Container from '$lib/design/atom/Container.svelte'
    import Skin from '$lib/design/quark/Skin'
    import Font from '$lib/design/quark/Font'
    import Loader from '$lib/design/molecule/Loader.svelte'

    const errorMessage = (err) => {
        if (err === undefined) {
            return undefined
        } else if (err === PeopleApiErrorType.MismatchedPasswords) {
            return 'The passwords do not match'
        } else if (err === PeopleApiErrorType.DuplicatePerson) {
            return 'This email is already registered'
        } else if (err === PeopleApiErrorType.InvalidProfileName) {
            return 'Your profile name seems to be invalid'
        } else {
            return 'Something went wrong... please try again later'
        }
    }

    export let people: PeopleApi
    export let initialError: string = undefined

    let profileName = ''
    let email = ''
    let password = ''
    let confirmPassword = ''
    let error = errorMessage(initialError)
    let attempting = false

    $: idlecolor = error ? Skin.Anger : Skin.Neutral
    $: focuscolor = error ? Skin.Anger : Skin.Fear

    const submit = async () => {
        error = undefined
        if (password !== confirmPassword) {
            error = errorMessage('mismatched-passwords')
            return
        }

        try {
            attempting = true
            await people.signUp(email, password, profileName)

            return goto('/please-verify')
        } catch(err) {
            attempting = false
            error = errorMessage(err?.message ?? 'unknown')
        }
    }
</script>

<main>
    <Container small>
        <Fettibox color={Skin.Disgust}>
            <Column center>
                <Title value="Sign Up for Sifetti" color={Skin.Disgust.Text} size={Font.Size.Neptune} />
                <form class="form" on:submit|preventDefault={submit} action={PeopleApi.SIGN_UP} method="post">
                    <Column>
                        <TextInput id="username" required type={TextFieldType.Text} name="username" label="Profile Name" placeholder="Enter a profile name" bind:value={profileName} {idlecolor} {focuscolor} />
                        <TextInput id="email" required type={TextFieldType.Email} name="email" label="Email" placeholder="Enter Email" bind:value={email} {idlecolor} {focuscolor} />
                        <TextInput id="password" required type={TextFieldType.Password} name="password" label="Password" placeholder="Enter Password" bind:value={password} {idlecolor} {focuscolor} />
                        <TextInput id="confirm-password" required type={TextFieldType.Password} name="confirm-password" label="Confirm Password" placeholder="Enter Password Again" bind:value={confirmPassword} {idlecolor} {focuscolor} />
                        {#if error}
                            <p class="error"><strong>{error}</strong></p>
                        {/if}
                        {#if attempting}
                            <Loader color={Skin.Fear} size={Font.Size.Mercury} />
                        {:else}
                            <Button submit>Sign In!</Button>
                        {/if}
                    </Column>
                </form>
            </Column>
        </Fettibox>
    </Container>
</main>

<style lang="scss">
    main {
        padding: var(--sp-dy-mg);
        background-color: var(--skin-bg);
    }

    .form {
        align-self: stretch;
        background-color: var(--skin-content);
        padding: var(--sp-dy-o);
    }

    .error {
        text-align: center;
        color: var(--skin-anger);
    }
</style>
