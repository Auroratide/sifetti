<slot></slot>

<style lang="scss" global>
    :root {
        --font: 'Poppins', -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif;

        --skin-bg: hsl(240, 100%, 97%);

        --skin-primary: hsl(210, 68%, 45%);
        --skin-primary-text: hsl(0, 0%, 100%);
        
        --skin-grey: hsl(0, 0%, 89%);
    }

    body {
        font-family: var(--font);
        background-color: var(--skin-bg);
    }
</style>