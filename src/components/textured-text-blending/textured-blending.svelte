<script lang="ts">
  import type { StoreValue } from "nanostores";
  import store from "./texture-store";
  type Store = StoreValue<typeof store>;
  const { background, color, fontSize, level, text } = store as Store;
</script>

<svg viewBox={`0 0 ${$background.width} ${$background.height}`}>
  <defs>
    <filter id="blend-svelte">
      <feImage
        href={$background.src}
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        result="Textured"
      ></feImage>
      <!-- Grayscle -->
      <feColorMatrix
        in="Textured"
        type="saturate"
        values="0"
        result="GrayscaleTextured"
      ></feColorMatrix>
      <feDisplacementMap
        in="SourceGraphic"
        in2="GrayscaleTextured"
        scale={$level}
        xChannelSelector="R"
        yChannelSelector="R"
        result="TexturedText"
      ></feDisplacementMap>
      <feColorMatrix
        in="TexturedText"
        type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.9 0"
        result="OpacityText"
      ></feColorMatrix>
      <feImage
        href={$background.src}
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        result="TexturedBackground"
      ></feImage>
      <feBlend in="TexturedBackground" in2="OpacityText" mode="multiply"
      ></feBlend>
    </filter>
  </defs>
  <image
    href={$background.src}
    x="0"
    y="0"
    width="100%"
    height="100%"
    preserveAspectRatio="none"
  />
  <text
    x="50%"
    y="68%"
    font-size={`${$fontSize}rem`}
    font-weight="bold"
    text-anchor="middle"
    alignment-baseline="middle"
    fill={$color}
    filter="url(#blend-svelte)"
  >
    {$text}
  </text>
</svg>
