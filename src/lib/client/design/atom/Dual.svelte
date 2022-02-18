<div class="dual">
    <slot></slot>
</div>

<style lang="scss">
    .dual {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(calc(37.5rem - var(--sp-dy-mg)), 100%), 1fr));
        gap: var(--sp-dy-mg);
    }
</style>