<div class="content">
    <slot></slot>
</div>

<style lang="scss">
    @import '../mixins.scss';
        
    .content {
        font-size: var(--font-sz-base);
        color: var(--skin-content-text);

        :global {
            h1, h2, h3, h4, h5, h6 {
                font-weight: var(--font-wt-b);
                line-height: 1.15em;
                margin-bottom: var(--sp-st-c);
            }

            h1 { font-size: var(--font-sz-jupiter); }
            h2 { font-size: var(--font-sz-saturn); }
            h3 { font-size: var(--font-sz-uranus); }
            h4 { font-size: var(--font-sz-neptune); }
            h5 { font-size: var(--font-sz-earth); }
            h6 {
                font-size: var(--font-sz-earth);
                font-style: italic;
            }

            p {
                line-height: 1.5em;
                margin-bottom: var(--sp-st-mg);
            }

            a {
                color: var(--skin-sad);
                filter: brightness(0.9); /* TODO Improve contrast for now until official shades are chosen */
            }

            a:hover, a:active {
                text-decoration: none;
            }

            a:visited {
                color: var(--skin-fear);
            }

            li {
                line-height: 1.5em;
            }

            ul, ol {
                padding-left: var(--sp-dy-mg);
            }

            dl dt {
                font-weight: var(--font-wt-b);
            }

            dl dt, dl dd {
                line-height: 1.5em;
            }

            dl dd + dt {
                margin-top: var(--sp-st-c);
            }

            dl.flat {
                display: grid;
                grid-template-columns: auto 1fr;

                dt {
                    margin: 0;
                }

                dt::after {
                    content: ':',
                }

                dd {
                    margin: 0;
                    padding-left: var(--sp-st-be);
                }
            }

            img {
                max-width: 100%;
            }

            blockquote {
                margin: 0 var(--sp-dy-o) var(--sp-st-mg);
                padding: var(--sp-dy-he) var(--sp-none) var(--sp-dy-he) var(--sp-dy-be);
                border-left: var(--sp-st-he) solid var(--skin-neutral);
            }

            blockquote blockquote {
                margin-left: var(--sp-dy-be);
            }

            blockquote > *:last-child {
                margin-bottom: 0;
            }

            code {
                padding: 0 var(--sp-st-he);
                background: var(--skin-neutral);
                line-height: 1.333em;
            }

            pre {
                @include fettibox(var(--sp-dy-c), var(--sp-dy-c), var(--skin-neutral));
            }

            pre code {
                display: block;
                background-color: var(--skin-content);
                padding: var(--sp-dy-he);
                box-shadow: 0 0.0625em 0.125em 0 hsla(0, 0%, 0%, 30%) inset;
                overflow: auto;
            }

            hr {
                margin: 0 var(--sp-dy-mg) var(--sp-st-mg);
                border-color: var(--skin-neutral);
            }

            table {
                border-spacing: var(--sp-st-he) var(--sp-st-h);
                margin: 0 auto var(--sp-st-mg);
            }

            table th {
                background-color: var(--skin-fear);
                color: var(--skin-fear-text);
                padding: var(--sp-st-he) var(--sp-st-o);
            }

            table td {
                padding: var(--sp-st-h) var(--sp-st-o);
            }

            table tr:nth-child(even) td {
                background-color: var(--skin-neutral);
            }
        }
    }
</style>
