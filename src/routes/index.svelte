<svelte:head>
    <title>Sifetti</title>
</svelte:head>

<header class="banner">
    <div class="container">
        <h1 class="title">Sifetti</h1>
        <section class="please-join">
            <p>Perfect document organization with zero folders.</p>
            <a href="/sign-in">Sign In</a>
        </section>
    </div>
</header>

<style lang="scss">
    .banner {
        display: flex;
        align-items: center;
        justify-content: center;
        background: hsl(210, 68%, 45%);
        min-height: 90vh;
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 90%);

        .container {
            max-width: 75rem;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
        }
    }

    .title {
        display: inline-block;
        font-size: 4rem;
        background-color: white;
        padding: 2rem;
        clip-path: polygon(1rem 1rem, 100% 0%, calc(100% - 1rem) calc(100% - 1rem), 0% 100%);
    }

    .please-join {
        color: white;
        font-size: 2rem;
        padding: 2rem;

        a {
            color: white;
        }
    }
</style>