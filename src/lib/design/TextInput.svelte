<script lang="ts" context="module">
    export enum TextFieldType {
        Text = 'text',
        Email = 'email',
        Password = 'password',
    }
</script>

<script lang="ts">
    import Skin from './Skin'

    export let id: string // required to use explicit labelling
    export let type: TextFieldType
    export let label: string
    export let name: string
    export let value: string
    export let required: boolean = false

    export let color: Skin.Scheme = Skin.Fear

    const onInput = (e: Event) => {
        value = (e.target as HTMLInputElement).value
    }
</script>

<div class="text-input" style="--color: {color}; --color-text: {color.Text};">
    <label for="{id}">{label}</label>
    <input {required} {id} {name} {type} {value} on:input={onInput} />
</div>

<style lang="scss">
    .text-input {
        display: flex;
        flex-direction: column;

        input {
            border-radius: 0;
            border: 0.125rem solid var(--skin-grey);

            &:focus {
                border-color: var(--color);
            }
        }

        label {
            background-color: var(--skin-grey);
            font-size: var(--font-sz-sm);
            padding: 0.25em 0.5em 0 0.5em;
            align-self: flex-start;
        }

        &:focus-within {
            label {
                background: var(--color);
                color: var(--color-text);
            }
        }
    }
</style>