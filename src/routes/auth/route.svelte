<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { PeopleApi } from '$lib/people/api'

    export const load: Load = async ({ fetch }) => {
        return {
            props: {
                people: new PeopleApi(fetch),
            }
        }
    }
</script>

<script lang="ts">
    import { onMount } from 'svelte'
    import { page } from '$app/stores'
    import { goto } from '$app/navigation'
    import Loader from '$lib/client/design/molecule/Loader.svelte'
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import FullError from '$lib/client/design/molecule/FullError.svelte'

    export let people: PeopleApi
    let error: string = undefined

    onMount(() => {
        const hash = $page.url.hash.substring(1)
        const params = new URLSearchParams(hash)

        people.authEvent(params.get('type'), {
            accessToken: params.get('access_token'),
            expiresIn: Number(params.get('expires_in')),
            refreshToken: params.get('refresh_token'),
        }).then(redirect => {
            return goto(redirect)
        }).catch(err => {
            error = err.message
        })
    })
</script>

<Navigation />
<main>
    {#if error}
        <FullError title="We're sorry!" message={error} />
    {:else}
        <Loader />
    {/if}
</main>

<style>
    main {
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>