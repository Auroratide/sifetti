<script lang="ts">
    import { createEventDispatcher } from 'svelte'
    import Title from '$lib/client/design/atom/Title.svelte'
    import VisuallyHidden from '$lib/client/design/atom/VisuallyHidden.svelte'

    export let id: string
    export let value: string

    const dispatch = createEventDispatcher()

    const onBlur = () => {
        dispatch('finishedit')
    }
</script>

<VisuallyHidden>
    <Title {value} />
</VisuallyHidden>
<div class="edit-title">
    <label for={id}>Edit Title</label>
    <input {id} type="text" name="title" placeholder="Untitled" bind:value={value} on:blur={onBlur} />
</div>

<style lang="scss">
    .edit-title {
        --border-width: 0.25rem;
        position: relative;
        padding-top: 0.125rem;

        input {
            position: relative;
            width: calc(100% + 2 * var(--border-width));
            font-size: var(--font-sz-jupiter);
            border: var(--border-width) solid transparent;
            border-radius: 0;
            line-height: 1;
            margin: 0 calc(-1 * var(--border-width)) 0.5em calc(-1 * var(--border-width));
            padding: 0;

            &:focus {
                border-color: var(--skin-sad);
            }
        }

        label {
            position: absolute;
            font-size: var(--font-sz-mars);
            padding: 0.125em 0.25em 0;
            background-color: var(--skin-sad);
            color: var(--skin-sad-text);
            
            opacity: 0;
            top: 0;
            left: calc(-1 * var(--border-width));
            transition: all 0.2s ease-in-out;
        }

        &:focus-within {
            label {
                top: -0.875rem;
                opacity: 1;
            }
        }
    }
</style>