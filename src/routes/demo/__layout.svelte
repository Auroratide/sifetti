<script lang="ts" context="module">
    import type { Id as NoteId } from '$lib/notes/types'
    import { linktoKey, LinkTo } from '$lib/routing/linkto'

    class DemoLinkTo extends LinkTo {
        note = (id: NoteId) => `/demo/notes/${id}`
    }
</script>

<script lang="ts">
    import { setContext } from 'svelte'
    import Fettibox, { FettiboxCorners } from '$lib/client/design/atom/Fettibox.svelte'
    import Skin from '$lib/client/design/quark/Skin'
    import Spacing from '$lib/client/design/quark/Spacing'
    import Font from '$lib/client/design/quark/Font'

    setContext(linktoKey, new DemoLinkTo())
</script>

<aside class="demo-warning">
    <Fettibox color={Skin.Joy} spacing={Spacing.Static.Helium} size={Font.Size.Mars} corners={FettiboxCorners.zero()}>
        <p>This is a <strong>demo</strong>. Changes you make are not saved!</p>
    </Fettibox>
</aside>
<slot></slot>

<style lang="scss">
    .demo-warning p {
        margin: 0;
        text-align: center;
    }
</style>