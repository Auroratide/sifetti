<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/shared/http-status'
    import { PeopleApi } from '$lib/client/people/api'

    export const load: Load = async ({ fetch, session }) => {
        const api = new PeopleApi(fetch)
        await api.signOut()

        session.person = undefined

        return {
            status: HttpStatus.Found,
            redirect: '/sign-in',
        }
    }
</script>

<p>Signing out...</p>
