<script lang="ts">
    import { session } from '$app/stores'
    import { FettiboxCorners } from './Fettibox.svelte'
    import Skin from './Skin'
    import { generator } from './random/context'

    $: hasPerson = $session.person

    export let color: Skin.Scheme = Skin.Fear

    let corners = FettiboxCorners.random(generator(), 1).override({
        tl: 0, tr: 0,
    })
</script>

<nav style="--skin-local: {color}; --skin-local-text: {color.Text}; {corners.style};">
    <ul>
        <li class="home"><a href="/">Sifetti</a></li>
        {#if hasPerson}
            <li><a href="/me">My Page</a></li>
            <li><a href="/sign-out">Sign Out</a></li>
        {:else}
            <li><a href="sign-in">Sign In</a></li>
        {/if}
    </ul>
</nav>
<div class="spacer"></div>

<style lang="scss">
    @import './mixins.scss';

    nav {
        filter: var(--elev-cumulus);
        @include fettibar(var(--sp-none), var(--sp-ze-be), var(--skin-local));

        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;

        ul {
            list-style: none;
            margin: 0;
            padding: 0;
            display: flex;

            .home {
                flex: 1;
            }

            a {
                display: inline-block;
                padding: var(--sp-st-be) var(--sp-st-c);
                color: var(--skin-local-text);
                text-decoration: none;
            }

            a:hover {
                text-decoration: underline;
            }
        }
    }

    .spacer {
        height: calc(2 * var(--sp-st-be) + 1em);
    }
</style>