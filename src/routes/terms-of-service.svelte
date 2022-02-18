<script lang="ts">
    import Title from '$lib/client/design/atom/Title.svelte'
    import Navigation from '$lib/client/design/molecule/Navigation.svelte'
    import Container from '$lib/client/design/atom/Container.svelte'
    import Content from '$lib/client/design/atom/Content.svelte'
</script>

<Navigation />
<main>
    <Container>
        <article>
            <Content>
                <Title value="Terms of Service" />
                <p><small>Last updated <time datetime="2022-01-21">21 Jan 2022</time></small></p>
                <p>Please read these terms of service ("terms", "terms of service") carefully before using the sifetti.com website (the "service") operated by Timothy Foster ("us", 'we", "our").</p>
                <h2>1. Conditions of Use</h2>
                <p>We will provide their services to you, which are subject to the conditions stated below in this document. Every time you visit this website, use its services or make a purchase, you accept the following conditions. This is why we urge you to read them carefully.</p>
                <h2>2. Privacy Policy</h2>
                <p>Before you continue using our website we advise you to read our <a href="/privacy-statement">privacy policy</a> regarding our user data collection. It will help you better understand our practices.</p>
                <h2>3. Copyright</h2>
                <p>Sifetti is, unless otherwise stated, the owner of all copyright and data rights in the Service and its contents. Individuals who have posted works to Sifetti are either the copyright owners of the component parts of that work or are posting the work under license from a copyright owner or his or her agent or otherwise as permitted by law. You may not reproduce, distribute, publicly display or perform, or prepare derivative works based on any of the Content including any such works without the express, written consent of Sifetti or the appropriate owner of copyright in such works. Sifetti does not claim ownership rights in your works or other materials posted by you to Sifetti (Your Content). You agree not to distribute any part of the Service other than Your Content in any medium other than as permitted in these Terms of Service or by use of functions on the Service provided by us. You agree not to alter or modify any part of the Service unless expressly permitted to do so by us or by use of functions on the Service provided by us.</p>
                <h3>3a. Your Content's Copyright</h3>
                <p>Sifetti makes no claim to any of your content and will never use it for anything without your permissions apart from displaying it in the pages of the service or any other third party that you have chosen to make the content available to. Sifetti will, at the best of its abilities, provide you with the means to prove any copyright infringment claim you wish to make against any other part. Sifetti strongly believes that the creators should be the sole owners of the content created and should always receive credit when due.</p>
                <h2>4. Communications</h2>
                <p>The entire communication with us is electronic. Every time you send us an email or visit our website, you are going to be communicating with us. You hereby consent to receive communications from us. If you subscribe to the news on our website, you are going to receive regular emails from us. We will continue to communicate with you by posting news and notices on our website and by sending you emails. You also agree that all notices, disclosures, agreements and other communications we provide to you electronically meet the legal requirements that such communications be in writing.</p>
                <h2>5. Applicable Law</h2>
                <p>By visiting this website, you agree that the laws of the State of Texas, without regard to principles of conflict laws, will govern these terms of service, or any dispute of any sort that might come between Timothy Foster and you, or its business partners and associates.</p>
                <h2>6. Disputes</h2>
                <p>Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or federal court of the State of Texas and you consent to exclusive jurisdiction and venue of such courts.</p>
                <h2>7. User Content</h2>
                <p>Visitors may post content as long as it is not obscene, illegal, defamatory, threatening, infringing of intellectual property rights, invasive of privacy or injurious in any other way to third parties. Content has to be free of software viruses, political campaign, and commercial solicitation.</p>
                <p>We reserve all rights (but not the obligation) to remove and/or edit such content. When you post your content, you grant Timothy Foster non-exclusive, royalty-free and irrevocable right to use, reproduce, publish, modify such content throughout the world in any media.</p>
                <h2>8. License and Site Access</h2>
                <p>We grant you a limited license to access and make personal use of this website. You are not allowed to download or modify it. This may be done only with written consent from us.</p>
                <h2>9. User Account</h2>
                <p>If you are an owner of an account on this website, you are solely responsible for maintaining the confidentiality of your private user details (username and password). You are responsible for all activities that occur under your account or password.</p>
                <p>We reserve all rights to terminate accounts, edit or remove content and cancel orders in their sole discretion.</p>
                <h2>10. Disclaimer of Warranties</h2>
                <p class="caps">Our Services are provided “as is.” Sifetti and its suppliers and licensors hereby disclaim all warranties of any kind, express or implied, including, without limitation, the warranties of merchantability, fitness for a particular purpose and non-infringement. Neither Sifetti nor its suppliers and licensors, makes any warranty that our Services will be error free or that access thereto will be continuous or uninterrupted. You understand that you download from, or otherwise obtain content or services through, our Services at your own discretion and risk.</p>
                <h2>11. General</h2>
                <p>This Agreement constitutes the entire agreement between Sifetti and you concerning the subject matter hereof, and they may only be modified by the posting by Sifetti of a revised version.</p>
                <p>If any part of this Agreement is held invalid or unenforceable, that part will be construed to reflect the parties' original intent, and the remaining portions will remain in full force and effect. A waiver by either party of any term or condition of this Agreement or any breach thereof, in any one instance, will not waive such term or condition or any subsequent breach thereof.</p>
                <p>You may assign your rights under this Agreement to any party that consents to, and agrees to be bound by, its terms and conditions; Sifetti may assign its rights under this Agreement without condition. This Agreement will be binding upon and will inure to the benefit of the parties, their successors and permitted assigns.</p>
            </Content>
        </article>
    </Container>
</main>

<style>
    .caps {
        text-transform: uppercase;
    }

    article {
        padding: var(--sp-dy-mg);
    }
</style>