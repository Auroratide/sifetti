<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status'

    export const load: Load = async ({ session }) => {
        if (session.person) {
            return {
                props: {
                    person: session.person,
                },
            }
        } else {
            return {
                status: HttpStatus.Found,
                redirect: '/sign-in',
            }
        }
    }
</script>

<script lang="ts">
    import type { Person } from '$lib/people/types'
    export let person: Person
</script>

<p>Hi {person.email}!</p>
<p>This is your profile page.</p>