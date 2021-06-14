<script>
    import { getContext } from 'svelte'
    import { key } from './context'
    import { checkVisibility } from './virtualize'

    export let index
    const { store, scrollPos } = getContext(key)

    let isVisible
    $: {
        if ($store.ready) {
            if ($store.dragIds.has(index)) {
                isVisible = true
            } else {
                isVisible = checkVisibility({
                    index,
                    itemDimension: $store.itemDimension,
                    wd: $store.wd,
                    scrollPos: $scrollPos,
                    margin: 200,
                })
            }
        } else {
            isVisible = false
        }
    }

</script>

{#if isVisible}
    <slot />
{/if}
