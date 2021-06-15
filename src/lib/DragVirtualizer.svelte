<script>
    import { getContext } from 'svelte'
    import { key } from './context'

    export let index
    const { store, scrollPos, strategy } = getContext(key)
    const { checkVisibility } = strategy

    let isVisible
    $: {
        if ($store.ready) {
            if ($store.dragIds.has(index) || $store.selectedIds.has(index)) {
                isVisible = true
            } else {
                isVisible = checkVisibility({
                    index,
                    itemDimension: $store.itemDimension,
                    wd: $store.wd,
                    scrollPos: $scrollPos,
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
