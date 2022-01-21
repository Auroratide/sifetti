<script lang="ts" context="module">
    import type { Load } from '@sveltejs/kit'
    import { HttpStatus } from '$lib/routing/http-status';

    export const load: Load = async ({ session }) => {
        if (session.person) {
            return {
                status: HttpStatus.Found,
                redirect: '/me',
            }
        } else {
            return { }
        }
    }
</script>

<script lang="ts">
    import Fettibox from '$lib/design/Fettibox.svelte'
    import Column from '$lib/design/Column.svelte'
    import Container from '$lib/design/Container.svelte'
    import LinkButton from '$lib/design/LinkButton.svelte'
    import Skin from '$lib/design/Skin'
    import Elevation from '$lib/design/Elevation'
    import Font from '$lib/design/Font'
</script>

<svelte:head>
    <title>Sifetti</title>
</svelte:head>

<main>
    <section class="banner">
        <Container>
            <div class="row">
                <Column center>
                    <Fettibox color={Skin.Content} elevation={Elevation.Ground} size={Font.Size.Jupiter}>
                        <h1>Sifetti</h1>
                    </Fettibox>
                </Column>
                <div class="left-on-large">
                    <p class="slogan"><strong>Perfect organization.<br />Zero folders.</strong></p>
                    <p class="info">If you've ever wished you could put one thing into multiple folders, you've come to the right place.</p>
                    <LinkButton href="/sign-in" color={Skin.Neutral}>Sign In</LinkButton>
                </div>
            </div>
        </Container>
    </section>
    <section class="closed-beta">
        <Container>
            <h2>We're in closed beta!</h2>
            <p>Sifetti is a work in progress.</p>
            <p>A small group of people are testing the initial product. Once the right features have been implemented, sign ups will be made available.</p>
            <p>Sifetti is an open source product! That means you can <a href="https://github.com/Auroratide/sifetti">view its progress on Github</a>.</p>
        </Container>
    </section>
</main>
<footer>

</footer>

<style lang="scss">
    p {
        line-height: 1.5em;
    }

    .banner {
        background-color: var(--skin-fear);
        color: var(--skin-fear-text);
        padding: calc(10vh + var(--sp-dy-s)) var(--sp-dy-o) calc(15vh + var(--sp-dy-s));
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 90%);
        margin-bottom: var(--sp-dy-s);

        .row {
            display: grid;
            grid-gap: var(--sp-dy-mg);
            grid-template-columns: repeat(auto-fill, minmax(min(calc(37.5rem - var(--sp-dy-mg)), 100%), 1fr));
        }

        h1 {
            color: var(--skin-content-text);
        }

        .slogan {
            font-size: var(--font-sz-jupiter);
            margin-bottom: var(--sp-st-he);

            strong {
                font-weight: normal;
            }
        }

        .info {
            font-size: var(--font-sz-neptune);
            margin-bottom: var(--sp-st-s);
        }

        :global(a) {
            font-size: var(--font-sz-neptune);
        }
    }

    .closed-beta {
        padding: var(--sp-dy-mg);

        h2 {
            font-size: var(--font-sz-jupiter);
            margin-bottom: var(--sp-st-c);
        }
    }

    .left-on-large {
        text-align: center;
    }

    @media screen and (min-width: 75rem) {
        .left-on-large {
            text-align: left;
        }
    }
</style>