<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { PeopleApi } from '$lib/people/api'

    export const load: Load = async ({ page, fetch }) => {
        return {
            props: {
                people: new PeopleApi(fetch),
                destination: page.query.get('from') ?? undefined,
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

    export let people: PeopleApi
    export let destination: string = '/me'

    let email: string = ''
    let password: string = ''

    const submit = async () => {
        try {
            const person = await people.signIn(email, password)
            $session.person = person

            return goto(destination)
        } catch(err) {
            console.error(err)
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
                        <TextInput id="email" required type={TextFieldType.Email} name="email" label="Email" placeholder="Enter Email" bind:value={email}></TextInput>
                        <TextInput id="password" required type={TextFieldType.Password} name="password" label="Password" placeholder="Enter Password" bind:value={password}></TextInput>
                        <Button submit>Sign In!</Button>
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
        height: 100vh;
    }

    .form {
        align-self: stretch;
        background-color: var(--skin-content);
        padding: var(--sp-dy-o);
    }
</style>