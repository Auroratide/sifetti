<script lang="ts">
    import Fettibox from '../atom/Fettibox.svelte'
    import Column from '../atom/Column.svelte'
    import Title from '../atom/Title.svelte'
    import Button from '../atom/Button.svelte'
    import Loader from './Loader.svelte'
    import Skin from '../quark/Skin'
    import Font from '../quark/Font'

    export let title: string
    export let submit: string
    export let action: string
    export let attempting: boolean
    export let error: string = undefined
</script>

<Fettibox>
    <Column center>
        <Title value={title} color={Skin.Sad.Text} size={Font.Size.Neptune} />
        <form on:submit|preventDefault {action} method="post">
            <Column>
                <slot></slot>
                {#if error !== undefined}
                    <p class="error"><strong>{error}</strong></p>
                {/if}
                {#if attempting}
                    <Loader color={Skin.Disgust} size={Font.Size.Mercury} />
                {:else}
                    <Button submit>{submit}</Button>
                {/if}
            </Column>
        </form>
    </Column>
</Fettibox>

<style lang="scss">
    form {
        align-self: stretch;
        background-color: var(--skin-content);
        padding: var(--sp-dy-o);
    }

    .error {
        text-align: center;
        color: var(--skin-anger);
    }
</style>