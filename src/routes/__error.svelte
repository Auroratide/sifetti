<script lang="ts" context="module">
    import type { ErrorLoad } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status'

    export const load: ErrorLoad = async ({ status, error }) => {
        if (status === HttpStatus.NotFound) {
            return {
                props: {
                    title: 'Page not found',
                    message: 'Looks like there isn\'t anything here.',
                },
            }
        } else {
            return {
                props: {
                    title: 'We\'re sorry!',
                    message: 'A problem seems to have occurred.',
                },
            }
        }
    }
</script>

<script lang="ts">
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import FullError from '$lib/client/design/molecule/FullError.svelte'

    export let title: string
    export let message: string
</script>

<Navigation />
<main>
    <FullError {title} {message} />
</main>

<style>
    main {
        padding: var(--sp-dy-mg);
    }
</style>