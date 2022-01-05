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

<svelte:head>
    <title>Sign In - Sifetti</title>
</svelte:head>

<div class="container">
    <section class="sign-in">
        <h1>Sign in to Sifetti</h1>
        <form class="form" on:submit|preventDefault={submit} action={PeopleApi.SIGN_IN} method="post">
            <label for="email">Email</label>
            <input required id="email" name="email" type="email" bind:value={email} />
            <label for="password">Password</label>
            <input required id="password" name="password" type="password" bind:value={password} />
            <button type="submit">Sign In!</button>
        </form>
    </section>
</div>

<style lang="scss">
    .container {
        padding: clamp(1rem, 2.5vw, 3rem);
        background-color: #f7f7ff;
        height: 100vh;
    }

    .sign-in {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: hsl(210, 68%, 45%);
        padding: 3rem;
        max-width: 25rem;
        margin: auto;
        clip-path: polygon(1rem 1rem, 100% 0%, calc(100% - 1rem) calc(100% - 1rem), 0% 100%);
        
        h1 {
            color: white;
            font-size: 1.5rem;
        }
    }

    .form {
        display: flex;
        flex-direction: column;
        background-color: white;
        padding: 2rem;

        label {
            font-weight: 700;
            font-size: 1rem;
        }

        input {
            margin-bottom: 1rem;
        }
    }
</style>