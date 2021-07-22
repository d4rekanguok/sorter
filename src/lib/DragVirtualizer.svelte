<script>
    import { getContext } from 'svelte'
    import { key } from './context'

    export let index
    const { store } = getContext(key)

    $: isVisible =
        $store.ready &&
        ($store.dragIds.has(index) ||
            $store.selectedIds.has(index) ||
            (index <= $store.visibleIdRange[1] + $store.selectedIds.size &&
                index >= $store.visibleIdRange[0]))
</script>

{#if isVisible}
    <slot />
{/if}
