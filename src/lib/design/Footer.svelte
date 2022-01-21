<script lang="ts">
    import { FettiboxCorners } from './Fettibox.svelte'
    import { generator } from './random/context'
    import Container from './Container.svelte'

    const year = new Date().getFullYear()
    const corners = FettiboxCorners.random(generator(), 1).override({
        bl: 0,
        br: 0,
    })
</script>

<footer style="{corners.style};">
    <Container>
        <div class="sections">
            <section class="copyright">
                <p>&copy; {year}, Auroratide</p>
            </section>
            <nav class="nav">
                <ul>
                    <li><a href="/terms-of-service">Terms</a></li>
                    <li><a href="/privacy-statement">Privacy</a></li>
                </ul>
            </nav>
            <section class="external">
                <ul>
                    <li><a href="https://github.com/Auroratide/sifetti">Open Source</a></li>
                    <li><a href="https://auroratide.com">Made by Auroratide</a></li>
                </ul>
            </section>
        </div>
    </Container>
</footer>

<style lang="scss">
    @import './mixins.scss';

    footer {
        font-size: var(--font-sz-mars);
        padding-left: var(--sp-dy-mg);
        padding-right: var(--sp-dy-mg);

        @include fettibar(var(--sp-dy-be), var(--sp-dy-be), var(--skin-neutral), var(--sp-dy-be));

        p {
            margin: 0;
            padding: var(--sp-st-be) 0;
        }

        .sections {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;

            .copyright {
                flex: 1 0;
            }

            .nav, .external {
                flex: 3 0;
            }

            .external ul {
                justify-content: right;
            }
        }

        ul {
            list-style: none;
            display: flex;
            padding: 0;
            margin: 0;

            li {
                flex-shrink: 0;
            }
        }

        a {
            color: var(--skin-neutral-text);
            display: inline-block;
            padding: var(--sp-st-be) var(--sp-st-c);
        }

        a:hover {
            text-decoration: none;
        }
    }

    @media screen and (min-width: 37.5rem) {
        footer .sections {
            flex-direction: row;
        }
    }
</style>