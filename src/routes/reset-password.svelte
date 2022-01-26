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
    import Button from '$lib/design/Button.svelte'
    import TextInput, { TextFieldType } from '$lib/design/TextInput.svelte'
    import Title from '$lib/design/Title.svelte'
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Column from '$lib/design/Column.svelte'
    import Container from '$lib/design/Container.svelte'
    import Skin from '$lib/design/Skin'
    import Font from '$lib/design/Font'
    import Loader from '$lib/design/Loader.svelte'
    import Navigation from '$lib/design/Navigation.svelte'

    const errorMessage = (err) => {
        if (err === undefined) {
            return undefined
        } else if (err === PeopleApiErrorType.MismatchedPasswords) {
            return 'The passwords do not match'
        } else {
            return 'Something went wrong... please try again later'
        }
    }

    export let people: PeopleApi
    export let initialError: string = undefined

    let password = ''
    let passwordConfirm = ''
    let error = errorMessage(initialError)
    let attempting = false

    $: idlecolor = error ? Skin.Anger : Skin.Neutral
    $: focuscolor = error ? Skin.Anger : Skin.Fear

    const submit = async () => {
        error = undefined
        if (password !== passwordConfirm) {
            error = errorMessage(PeopleApiErrorType.MismatchedPasswords)
            return
        }

        try {
            attempting = true
            await people.resetPassword(password)

            return goto('/sign-in')
        } catch(err) {
            attempting = false
            error = errorMessage(err?.message ?? 'unknown')
        }
    }
</script>

<Navigation />
<main>
    <Container small>
        <Fettibox color={Skin.Sad}>
            <Column center>
                <Title value="Reset your Password" color={Skin.Sad.Text} size={Font.Size.Neptune} />
                <form class="form" on:submit|preventDefault={submit} action={PeopleApi.SIGN_IN} method="post">
                    <Column>
                        <TextInput id="password" required type={TextFieldType.Password} name="password" label="Password" placeholder="Enter Password" bind:value={password} {idlecolor} {focuscolor} />
                        <TextInput id="password-confirm" required type={TextFieldType.Password} name="password-confirm" label="Confirm Password" placeholder="Enter Password Again" bind:value={passwordConfirm} {idlecolor} {focuscolor} />
                        {#if error}
                            <p class="error"><strong>{error}</strong></p>
                        {/if}
                        {#if attempting}
                            <Loader color={Skin.Disgust} size={Font.Size.Mercury} />
                        {:else}
                            <Button submit color={Skin.Fear}>Submit!</Button>
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