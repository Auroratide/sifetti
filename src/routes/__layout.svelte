<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'

    export const load: Load = async ({ fetch }) => {
        const seed = await fetch('/api/random-seeds')
            .then(res => res.json())
            .then(json => json.seed)
            .catch(() => '') // this shouldn't break the app

        return {
            props: {
                seed,
            },
        }
    }
</script>

<script lang="ts">
    import { setContext } from 'svelte'
    import { key } from '$lib/design/random/context'
    import { linktoKey, LinkTo } from '$lib/routing/linkto'
    import { seeded, usingMath } from '$lib/design/random/generators'
    import ToastError from '$lib/design/ToastError.svelte'
    import Footer from '$lib/design/Footer.svelte'

    export let seed: string = ''

    setContext(key, seed.length > 0 ? seeded(seed) : usingMath())
    setContext(linktoKey, new LinkTo())
</script>

<slot></slot>
<Footer />
<ToastError id="toast-error" />

<style lang="scss" global>
    @import './_css/variables';
    @import './_css/light';

    body {
        font-family: var(--font-reg);
        font-size: var(--font-sz-base);
        background-color: var(--skin-bg);
    }

    main {
        min-height: 85vh;
    }

    code {
        font-family: var(--font-code);
    }
</style>