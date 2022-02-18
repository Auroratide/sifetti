<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/shared/http-status'
    import { PeopleApi } from '$lib/client/people/api'

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
