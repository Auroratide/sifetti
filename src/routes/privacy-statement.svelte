<script lang="ts">
    import Title from '$lib/design/atom/Title.svelte'
    import Navigation from '$lib/design/molecule/Navigation.svelte'
    import Container from '$lib/design/atom/Container.svelte'
    import Content from '$lib/design/atom/Content.svelte'
</script>

<Navigation />
<main>
    <Container>
        <article>
            <Content>
                <Title value="Privacy Statement" />
                <p><small>Last updated <time datetime="2022-01-21">21 Jan 2022</time></small></p>
                <p>Timothy Foster ("us", "we", or "our") operates sifetti.com (the "Site"). This page informs you of our policies regarding the collection, use and disclosure of Personal Information we receive from users of the Site.</p>
                <p>We use your Personal Information only for providing and improving the Site. By using the Site, you agree to the collection and use of information in accordance with this policy.</p>
                <h2>Information Collection and Use</h2>
                <p>While using the Site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name and email ("Personal Information").</p>
                <h2>Cookies</h2>
                <p>Cookies are files with small amounts of data, which may include an anonymous unique identifier. Cookies are sent to your browser from a web site and stored on your computer's hard drive.</p>
                <p>Like many sites, we use "cookies" to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.</p>
                <h2>Security</h2>
                <p>The security of your Personal Information is important to us, but remember that no method of transmission over the internet, or method of electronic storage, is 100% secure. While we strive to use commercially exemplary means to protect your Personal Information, we cannot guarantee its absolute secrecy.</p>
                <h2>Changes to this Privacy Statement</h2>
                <p>We reserve the right to update or change our Privacy Policy at any time and you should check this Privacy Policy periodically. Your continued use of the Service after we post any modifications to the Privacy Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy</p>
            </Content>
        </article>
    </Container>
</main>

<style>
    article {
        padding: var(--sp-dy-mg);
    }
</style>