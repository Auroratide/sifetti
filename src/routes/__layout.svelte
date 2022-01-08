<slot></slot>

<style lang="scss" global>
    :root {
        --font: 'Kanit', -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Noto Sans', 'Ubuntu', 'Droid Sans', 'Helvetica Neue', sans-serif;
    }

    body {
        font-family: var(--font);
    }

    input[type="text"],
    input[type="email"],
    input[type="password"],
    textarea {
        border-radius: 0;
        border: 0.125em solid #e2e2e2;

        &:focus {
            border-color: hsl(210, 68%, 45%);
        }
    }
</style>