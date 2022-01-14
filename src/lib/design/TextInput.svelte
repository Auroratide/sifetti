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

    export let color: Skin.Scheme = Skin.Fear

    const labelCorners = FettiboxCorners.random().override({
        bl: 0,
        br: 0,
    })

    const onInput = (e: Event) => {
        value = (e.target as HTMLInputElement).value
    }
</script>

<div class="text-input" style="--color: {color}; --color-text: {color.Text};">
    <label style="{labelCorners.style};" for="{id}">{label}</label>
    <input {required} {id} {name} {type} {value} on:input={onInput} />
</div>

<style lang="scss">
    @import './mixins.scss';

    .text-input {
        display: flex;
        flex-direction: column;

        input {
            border-radius: 0;
            padding: var(--sp-st-be);
            border: var(--sp-st-h) solid var(--skin-grey);

            &:focus {
                border-color: var(--color);
            }
        }

        label {
            --pad-tb: var(--sp-st-he);
            --pad-lr: var(--sp-st-be);
            --fettibox-color: var(--skin-grey);
            font-size: var(--font-sz-sm);
            align-self: flex-start;

            @include fettibox;
            padding-bottom: 0;
            bottom: -1px; /* clip-path from fettibox is creating the most miniscule of gaps */
        }

        &:focus-within {
            label {
                --fettibox-color: var(--color);
                color: var(--color-text);
            }
        }
    }
</style>