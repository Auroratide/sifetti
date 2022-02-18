<script lang="ts">
    import Title from '../atom/Title.svelte'
    import Fettibox from '../atom/Fettibox.svelte'
    import Skin from '../quark/Skin'
    import Column from '../atom/Column.svelte'
    import Spacing from '../quark/Spacing'

    export let title: string
    export let message: string
</script>

<div class="full-error">
    <Column center>
        <Fettibox color={Skin.Anger} spacing={Spacing.Dynamic.Oxygen} unclippedSpace={Spacing.Dynamic.Oxygen}>
            <Title value={title} />
        </Fettibox>
        <p class="message">{message}</p>
        <p>Try <a href="/">returning to the home page.</a></p>
    </Column>
</div>

<style>
    .full-error {
        text-align: center;
    }

    .message {
        font-size: var(--font-sz-uranus);
    }
</style>