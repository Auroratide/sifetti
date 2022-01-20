<script lang="ts" context="module">
    import type { ErrorLoad } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status'

    export const load: ErrorLoad = async ({ status }) => {
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
    import Title from '$lib/design/Title.svelte'
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Skin from '$lib/design/Skin'
    import Column from '$lib/design/Column.svelte'
    import Spacing from '$lib/design/Spacing'

    export let title: string
    export let message: string
</script>

<main>
    <Column center>
        <Fettibox color={Skin.Anger} spacing={Spacing.Dynamic.Oxygen} unclippedSpace={Spacing.Dynamic.Oxygen}>
            <Title value={title} />
        </Fettibox>
        <p class="message">{message}</p>
        <p>Try <a href="/">returning to the home page.</a></p>
    </Column>
</main>

<style>
    main {
        padding: var(--sp-dy-mg);
        text-align: center;
    }

    .message {
        font-size: var(--font-sz-uranus);
    }
</style>