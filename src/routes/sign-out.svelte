<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status'
    import { PeopleApi } from '$lib/people/api'

    export const load: Load = async ({ fetch }) => {
        const api = new PeopleApi(fetch)
        await api.signOut()

        return {
            status: HttpStatus.Found,
            redirect: '/sign-in',
        }
    }
</script>

<p>Signing out...</p>
