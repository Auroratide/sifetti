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
    import Fettibox from '$lib/client/design/atom/Fettibox.svelte'
    import Column from '$lib/client/design/atom/Column.svelte'
    import Container from '$lib/client/design/atom/Container.svelte'
    import LinkButton from '$lib/client/design/atom/LinkButton.svelte'
    import Skin from '$lib/client/design/quark/Skin'
    import Elevation from '$lib/client/design/quark/Elevation'
    import Font from '$lib/client/design/quark/Font'
    import Dual from '$lib/client/design/atom/Dual.svelte'
    import Spacing from '$lib/client/design/quark/Spacing'
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
    <section class="demo">
        <Container>
            <Dual>
                <Container small>
                    <Column>
                        <h2>Tags maximize flexibility.</h2>
                        <p>Instead of putting things in folders, you can <strong>tag</strong> notes with categorical names. Tags have been around for a while, but it's amazing what happens when they become <em>the</em> primary organizational tool.</p>
                        <p>Try out the demo and see for yourself! Though Sifetti is still being built, all the basics are there to play with.</p>
                        <LinkButton href="/demo" color={Skin.Disgust}>Try the demo!</LinkButton>
                    </Column>
                </Container>
                <Fettibox color={Skin.Sad} elevation={Elevation.Ground} spacing={Spacing.Dynamic.Oxygen}>
                    <a href="/demo"><img src="/demo.png" alt="Only notes for one selected tag are listed. Click to try the demo!" width="1574" height="860" /></a>
                </Fettibox>
            </Dual>
        </Container>
    </section>
    <section class="closed-beta">
        <Container small>
            <h2>We're in closed beta</h2>
            <p>Sifetti is a work in progress.</p>
            <p>A small group of people are testing the initial product. Once the right features have been implemented, sign ups will be made available.</p>
            <p>Sifetti is an open source product! That means you can <a href="https://github.com/Auroratide/sifetti">view its progress on Github</a>.</p>
        </Container>
    </section>
</main>

<style lang="scss">
    p {
        line-height: 1.5em;
    }

    section {
        margin-bottom: var(--sp-dy-s);
    }

    .banner {
        background-color: var(--skin-fear);
        color: var(--skin-fear-text);
        padding: calc(10vh + var(--sp-dy-s)) var(--sp-dy-o) calc(15vh + var(--sp-dy-s));
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 90%);

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

    section:not(.banner) {
        padding: var(--sp-dy-mg);
    }

    h2 {
        font-size: var(--font-sz-jupiter);
        margin-bottom: var(--sp-st-c);
    }

    .left-on-large {
        text-align: center;
    }

    img {
        width: 100%;
        height: 100%;
    }

    @media screen and (min-width: 75rem) {
        .left-on-large {
            text-align: left;
        }
    }
</style>