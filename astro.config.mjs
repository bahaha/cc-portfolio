import { defineConfig } from "astro/config";
import aws from "astro-sst";
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import react from "@astrojs/react";
import svgr from "vite-plugin-svgr";

// FIXME: using analogjsangular() integration will cause typescript import sliently fail with undefined module import
import analogjsangular from "@analogjs/astro-angular";

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: aws(),
  integrations: [tailwind(), vue(), svelte(), react()],
  vite: {
    plugins: [svgr()],
  },
});
