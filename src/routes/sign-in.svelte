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
    import Button from '$lib/design/Button.svelte'
    import TextInput, { TextFieldType } from '$lib/design/TextInput.svelte'
    import Title from '$lib/design/Title.svelte'
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Column from '$lib/design/Column.svelte'
    import Container from '$lib/design/Container.svelte'
    import Skin from '$lib/design/Skin'
    import Font from '$lib/design/Font'
    import Loader from '$lib/design/Loader.svelte'

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
        <Fettibox>
            <Column center>
                <Title value="Sign in to Sifetti" color={Skin.Sad.Text} size={Font.Size.Neptune} />
                <form class="form" on:submit|preventDefault={submit} action={PeopleApi.SIGN_IN} method="post">
                    <input type="hidden" name="destination" bind:value={destination} />
                    <Column>
                        <TextInput id="email" required type={TextFieldType.Email} name="email" label="Email" placeholder="Enter Email" bind:value={email} {idlecolor} {focuscolor} />
                        <TextInput id="password" required type={TextFieldType.Password} name="password" label="Password" placeholder="Enter Password" bind:value={password} {idlecolor} {focuscolor} />
                        {#if error}
                            <p class="error"><strong>{error}</strong></p>
                        {/if}
                        {#if attempting}
                            <Loader color={Skin.Disgust} size={Font.Size.Mercury} />
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