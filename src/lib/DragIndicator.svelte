<script>
    import { getContext } from 'svelte'
    import { key } from './context'

    const { store, dropIndex, strategy } = getContext(key)
    const { name = '', place } = strategy
    $: pos = place({ index: $dropIndex, dimension: $store.itemDimension })
    $: opacity = $store.state === 'dragging' ? 1 : 0
</script>

<div
    class="indicator-wrapper"
    style={`
    width: ${$store.itemDimension[0]}px;
    height: ${$store.itemDimension[1]}px;
    transform: translate(${pos[0]}px, ${pos[1]}px);
    opacity: ${opacity};
`}
>
    <div class="default-indicator {name}" />
</div>

<style>
    .indicator-wrapper {
        position: absolute;
        pointer-events: none;
        z-index: 5;
    }
    .default-indicator {
        position: relative;
        /* width: 100%; */
        /* height: 2px; */
        background-color: tomato;
    }
    :global(.horizontal).default-indicator {
        height: 100%;
        width: 2px;
    }
    :global(.vertical).default-indicator {
        width: 100%;
        height: 2px;
    }
</style>
