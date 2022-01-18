<script lang="ts" context="module">
    export enum TextFieldType {
        Text = 'text',
        Email = 'email',
        Password = 'password',
    }
</script>

<script lang="ts">
    import Skin from './Skin'
    import { FettiboxCorners } from './Fettibox.svelte'

    export let id: string // required to use explicit labelling
    export let type: TextFieldType
    export let label: string
    export let name: string
    export let value: string
    export let required: boolean = false
    export let placeholder: string = ''

    export let color: Skin.Scheme = Skin.Fear

    const labelCorners = FettiboxCorners.random().override({
        bl: 0,
        br: 0,
    })

    const onInput = (e: Event) => {
        value = (e.target as HTMLInputElement).value
    }
</script>

<div class="text-input" style="--skin-local: {color}; --skin-local-text: {color.Text};">
    <label style="{labelCorners.style};" for="{id}">{label}</label>
    <div class="input-container">
        <input {required} {id} {name} {type} {value} {placeholder} on:input={onInput} />
        <slot name="action"></slot>
    </div>
</div>

<style lang="scss">
    @import './mixins.scss';

    .text-input {
        display: flex;
        flex-direction: column;

        .input-container {
            display: flex;
            border: var(--sp-st-h) solid var(--skin-grey);
            background-color: var(--skin-content);

            &:focus-within {
                border-color: var(--skin-local);
            }
        }

        input {
            border-radius: 0;
            padding: var(--sp-st-be);
            border: none;
            flex: 1;
            min-width: 0;
            background: none;
        }

        label {
            --skin-local-fetti: var(--skin-grey);
            font-size: var(--font-sz-mars);
            align-self: flex-start;

            @include fettibox(var(--sp-st-he), var(--sp-st-be), var(--skin-local-fetti));
            padding-bottom: 0;
            bottom: -1px; /* clip-path from fettibox is creating the most miniscule of gaps */
        }

        &:focus-within {
            label {
                --skin-local-fetti: var(--skin-local);
                color: var(--skin-local-text);
            }
        }
    }
</style>