<script lang="ts">
    import { onMount } from 'svelte'
    import Font from '../quark/Font'
    import Skin from '../quark/Skin'
    import { generator } from '../random/context'
    import { FettiboxCorners } from './Fettibox.svelte'

    export let id: string
    export let label: string
    export let color: Skin.Scheme = Skin.Sad
    export let size: Font.Size = Font.Size.Earth
    export let corners: FettiboxCorners = FettiboxCorners.random(generator())

    let element: HTMLSelectElement
    let selectedText = ''
    const updateSelectedText = () => {
        const selectedElement = element.options[element.options.selectedIndex]
        selectedText = selectedElement.textContent
    }

    onMount(() => {
        updateSelectedText()
        element.addEventListener('change', updateSelectedText)
    })
</script>

<div class="select-container" style="--font-sz-local: {size}; --skin-local: {color}; --skin-local-text: {color.Text}; {corners.style};">
    <label for={id}>{label}</label>
    <span class="fetti-container">
        <span class="selected">{selectedText}</span>
        <span class="caret" aria-hidden="true">&#9660;</span>
        <select bind:this={element} {id} on:change>
            <slot></slot>
        </select>
    </span>
</div>

<style lang="scss">
    @import "../mixins.scss";

    .select-container {
        font-size: var(--font-sz-local);

        label {
            font-weight: var(--font-wt-b);
        }

        .fetti-container {
            @include fettibox(var(--sp-st-h), var(--sp-st-be), var(--skin-local));
            display: inline-grid;
            place-items: center left;
        }

        .selected {
            grid-column: 1;
            grid-row: 1;
            display: inline-block;
            padding: 0 var(--sp-st-he);
            color: var(--skin-local-text);
        }

        .caret {
            grid-column: 1;
            grid-row: 1;
            justify-self: right;
            color: var(--skin-local-text);
        }

        select {
            grid-column: 1;
            grid-row: 1;
            background: transparent;
            border: none;
            cursor: pointer;
            opacity: 0.00001;
        }
    }
</style>