<script lang="ts">
    import Title from '$lib/client/design/atom/Title.svelte'
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import Container from '$lib/client/design/atom/Container.svelte'
    import Content from '$lib/client/design/atom/Content.svelte'
    import Button from '$lib/client/design/atom/Button.svelte'
    import Skin from '$lib/client/design/quark/Skin'
</script>

<Navigation />
<main>
    <Container>
        <article>
            <Content>
                <Title value="Styleguide" />
                <dl class="flat">
                    <dt>Fear</dt>
                    <dd><Button color={Skin.Fear}>Click Me</Button></dd>
                    <dt>Joy</dt>
                    <dd><Button color={Skin.Joy}>Click Me</Button></dd>
                    <dt>Sad</dt>
                    <dd><Button color={Skin.Sad}>Click Me</Button></dd>
                    <dt>Disgust</dt>
                    <dd><Button color={Skin.Disgust}>Click Me</Button></dd>
                    <dt>Anger</dt>
                    <dd><Button color={Skin.Anger}>Click Me</Button></dd>
                </dl>
            </Content>
        </article>
    </Container>
</main>

<style>
    article {
        padding: var(--sp-dy-mg);
    }
</style>