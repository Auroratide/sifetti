<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'

    export const load: Load = async ({ fetch }) => {
        const numbers = await fetch('/api/random-numbers')
            .then(res => res.json())
            .then(json => json.items)
            .catch(() => []) // this shouldn't break the app

        return {
            props: {
                numbers,
            },
        }
    }
</script>

<script lang="ts">
    import { setContext } from 'svelte'
    import { key } from '$lib/design/random/context'
    import { cyclic, usingMath } from '$lib/design/random/generators'
    import ToastError from '$lib/design/ToastError.svelte'
    import Footer from '$lib/design/Footer.svelte'

    export let numbers: number[] = []

    setContext(key, numbers.length > 0 ? cyclic(numbers) : usingMath())
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