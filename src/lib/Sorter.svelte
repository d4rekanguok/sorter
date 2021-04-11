<script lang="ts">
  interface Data {
    id: string;
    value: string;
    label: string;
  }
  const data: Data[] = [
    { id: "1", value: "tomato", label: "Tomato" },
    { id: "2", value: "pink", label: "Pink" },
    { id: "3", value: "aquamarine", label: "Aquamarine" },
    { id: "4", value: "slateblue", label: "Slateblue" },
  ];
</script>

<div>
  <ul>
    {#each data as item (item.id)}
      <li class="drag-wrapper">
        <slot {item} />
      </li>
    {/each}
  </ul>
</div>

<style>
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
</style>
