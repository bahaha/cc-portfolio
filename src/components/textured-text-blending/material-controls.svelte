<script lang="ts">
  import type { StoreValue } from "nanostores";
  import store from "./texture-store";
  type Store = StoreValue<typeof store>;
  const { text, color } = store as Store;
</script>

<div class="my-4 flex items-center gap-1">
  <input
    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring inline-block h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    type="text"
    bind:value={$text}
  />
  <input class="h-8 w-8" type="color" bind:value={$color} />
</div>
