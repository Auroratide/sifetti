<script lang="ts">
    export let expanded = false
</script>

<div class="sheathed" class:expanded>
    <div class="content">
        <slot></slot>
    </div>
    <div class="activator">
        <slot name="activator"></slot>
    </div>
</div>

<style lang="scss">
    .content {
        position: fixed;
        height: 50vh;
        left: 0;
        right: 0;
        bottom: -50vh;
        padding: var(--sp-st-c);
        background-color: var(--skin-content);
        filter: var(--elev-cirrus-up);
        transition: bottom 0.4s ease-in-out;
        z-index: 999;
    }

    .expanded {
        height: 50vh;

        .content {
            bottom: 0;
        }
    }

    .activator {
        position: fixed;
        right: var(--sp-st-c);
        bottom: var(--sp-st-c);
        z-index: 998;
    }

    @media screen and (min-width: 50rem) {
        .content {
            position: relative;
            height: auto;
            bottom: 0;
            padding: 0;
            background: none;
            filter: none;
            z-index: 1;
        }

        .activator {
            display: none;
        }
    }
</style>