<script lang="ts">
    import { tick } from 'svelte'
    import { FettiboxCorners } from '$lib/client/design/atom/Fettibox.svelte'
    import { generator } from '$lib/client/design/random/context'
    import { navHeight } from '$lib/client/design/molecule/Navigation.svelte'

    export let id: string
    export let editing: boolean = false
    export let value: string = ''

    let scrollOffset = $navHeight

    let inputelement: HTMLElement
    const focusOnInput = () => {
        window.scrollBy({
            left: 0,
            top: inputelement.parentElement.getBoundingClientRect().top - scrollOffset,
        })

        inputelement.focus()
    }

    $: {
        if (editing && inputelement) {
            tick().then(focusOnInput)
        }
    }

    const labelCorners = FettiboxCorners.random(generator()).override({
        bl: 0,
        br: 0,
    })

    const startEditing = () => {
        editing = true
    }
</script>

<div class="editable-content" class:editing>
    <div class="content-area" on:dblclick={startEditing}>
        <slot></slot>
    </div>
    <div class="edit">
        <label for={id} style="{labelCorners.style};">Content</label>
        <textarea bind:this={inputelement} {id} on:blur bind:value></textarea>
    </div>
</div>

<style lang="scss">
    @import '../../design/mixins.scss';

    .editable-content {
        display: grid;
        grid-template: auto / 100%;

        .edit {
            display: none;
            grid-column: 1;
            grid-row: 1;
            height: 80vh;
            flex-direction: column;
            margin-bottom: var(--sp-dy-c);

            textarea {
                flex: 1;
                border-radius: 0;
                padding: var(--sp-st-be);
                border: var(--sp-st-h) solid var(--skin-neutral);
                width: 100%;

                &:focus {
                    border-color: var(--skin-sad);
                }
            }

            label {
                --skin-local-fetti: var(--skin-neutral);
                font-size: var(--font-sz-mars);
                align-self: flex-start;
                color: var(--skin-neutral-text);

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
            display: none;
        }
    }
</style>