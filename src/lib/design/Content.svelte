<section class="content">
    <slot></slot>
</section>

<style lang="scss">
    .content {
        font-size: var(--font-sz-base);

        :global(h1), :global(h2),
        :global(h3), :global(h4),
        :global(h5), :global(h6) {
            font-weight: var(--font-wt-b);
            line-height: 2em;
            margin: 0;
        }

        :global(h1) {
            font-size: var(--font-sz-jupiter);
        }

        :global(h2) {
            font-size: var(--font-sz-saturn);
        }

        :global(h3) {
            font-size: var(--font-sz-uranus);
        }

        :global(h4) {
            font-size: var(--font-sz-neptune);
        }

        :global(h5) {
            font-size: var(--font-sz-earth);
        }

        :global(h6) {
            font-size: var(--font-sz-earth);
            font-style: italic;
        }

        :global(p) {
            line-height: 1.5em;
            margin-bottom: 1.5em;
        }

        :global(li) {
            line-height: 1.5em;
        }
    }
</style>
