<script lang="ts">
  import type { StoreValue } from "nanostores";
  import store, { textureBackgrounds } from "./texture-store";
  import { cn } from "@/utils/ui-helpers";
  type Store = StoreValue<typeof store>;
  const { background, color, fontSize, level, text } = store as Store;
</script>

<section class="bg-secondary container py-2">
  <span
    class="text=sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Background
  </span>
  <div class="grid grid-cols-3 items-start gap-3">
    {#each textureBackgrounds as bg}
      <button on:click={() => background.set(bg)}>
        <img
          src={bg.src}
          alt={bg.name}
          class={cn("border-input rounded border-2 p-1", {
            "border-primary": $background.src === bg.src,
          })}
        />
      </button>
    {/each}
  </div>
  <label
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <span class="font-semibold">Font Size (rem unit)</span>
    <div class="mb-2 mt-0.5 flex items-center gap-1">
      <input
        type="range"
        step="0.5"
        min="0.5"
        max="20"
        bind:value={$fontSize}
      />
    </div>
  </label>
  <label
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <span class="font-semibold">Level</span>
    <div class="mb-2 mt-0.5 flex items-center gap-1">
      <input type="range" step="5" min="0" max="50" bind:value={$level} />
    </div>
  </label>
  <label
    class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    <span class="font-semibold">Text</span>
    <div class="mb-2 mt-0.5 flex items-center gap-1">
      <input
        class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring inline-block h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        type="text"
        bind:value={$text}
      />
      <input class="h-8 w-8" type="color" bind:value={$color} />
    </div>
  </label>
</section>
