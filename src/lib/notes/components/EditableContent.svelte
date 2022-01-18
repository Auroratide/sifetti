<script lang="ts">
    import { createEventDispatcher, tick } from 'svelte'
    import { FettiboxCorners } from '../../design/Fettibox.svelte'

    export let id: string
    export let editing: boolean = false
    export let value: string = ''

    let inputelement: HTMLElement

    $: {
        if (editing && inputelement) {
            tick().then(() => inputelement.focus())
        }
    }

    const dispatch = createEventDispatcher()

    const labelCorners = FettiboxCorners.random().override({
        bl: 0,
        br: 0,
    })

    const startEditing = () => {
        editing = true
    }

    const stopEditing = () => {
        editing = false
        // I like that it says "finish edit" and "finished it" at the same time
        dispatch('finishedit')
    }
</script>

<div class="editable-content" class:editing>
    <div class="content-area" on:dblclick={startEditing}>
        <slot></slot>
    </div>
    <div class="edit">
        <label for={id} style="{labelCorners.style};">Content</label>
        <textarea bind:this={inputelement} {id} on:blur={stopEditing} bind:value></textarea>
    </div>
</div>

<style lang="scss">
    @import '../../design/mixins.scss';

    .editable-content {
        display: grid;
        grid-template: 1fr / 1fr;

        .edit {
            display: none;
            grid-column: 1;
            grid-row: 1;
            flex-direction: column;

            textarea {
                flex: 1;
                border-radius: 0;
                padding: var(--sp-st-be);
                border: var(--sp-st-h) solid var(--skin-grey);
                width: 100%;

                &:focus {
                    border-color: var(--skin-sad);
                }
            }

            label {
                --skin-local-fetti: var(--skin-grey);
                font-size: var(--font-sz-mars);
                align-self: flex-start;

                @include fettibox(var(--sp-st-he), var(--sp-st-be), var(--skin-local-fetti));
                padding-bottom: 0;
            }

            &:focus-within {
                label {
                    --skin-local-fetti: var(--skin-sad);
                    color: var(--skin-sad-text);
                }
            }
        }

        .content-area {
            grid-column: 1;
            grid-row: 1;
            min-height: 20em;
        }
    }

    .editable-content.editing {
        .edit {
            display: flex;
        }

        .content-area {
            visibility: hidden;
        }
    }
</style>