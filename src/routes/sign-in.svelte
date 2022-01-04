<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { PeopleApi } from '$lib/people/api'

    export const load: Load = async ({ fetch }) => {
        return {
            props: {
                people: new PeopleApi(fetch),
            },
        }
    }
</script>

<script lang="ts">
    import { session } from '$app/stores'
    import { goto } from '$app/navigation'

    export let people: PeopleApi

    let email: string
    let password: string

    const submit = async () => {
        try {
            const person = await people.signIn(email, password)
            $session.person = person

            return goto('/me')
        } catch(err) {
            console.error(err)
        }
    }
</script>

<form on:submit|preventDefault={submit} action={PeopleApi.SIGN_IN} method="post">
    <label for="email">Email:</label>
    <input required id="email" name="email" type="email" bind:value={email} />
    <label for="password">Password:</label>
    <input required id="password" name="password" type="password" bind:value={password} />
    <button type="submit">Sign In!</button>
</form>
