---
layout: ../../../layouts/MarkdownLayout.astro
title: 📖 Texture Blending
---

# Texture Blending

Texture blending is a visual effect where text is blended into a given texture, creating an impression that the text is part of the textured surface. This documentation outlines the implementation of texture blending using SVG filters in a web application.

<blockquote class="not-prose bg-amber-100 border-l-4 p-4 border-amber-500 text-amber-900">
    <p class="text-xl">🚧</p>
    <p class="ml-4"> Performance: While SVG filters are powerful, it's important to note that they can be performance-intensive, especially with complex effects or high-resolution images. Optimization and performance testing should be considered when using them in a web application.</p>
</blockquote>

## Preview

![textured-text](https://private-user-images.githubusercontent.com/7671532/318100005-b368dea7-eb26-4171-aefd-8e9935dfe2ae.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MTE5MDMyOTQsIm5iZiI6MTcxMTkwMjk5NCwicGF0aCI6Ii83NjcxNTMyLzMxODEwMDAwNS1iMzY4ZGVhNy1lYjI2LTQxNzEtYWVmZC04ZTk5MzVkZmUyYWUucG5nP1gtQW16LUFsZ29yaXRobT1BV1M0LUhNQUMtU0hBMjU2JlgtQW16LUNyZWRlbnRpYWw9QUtJQVZDT0RZTFNBNTNQUUs0WkElMkYyMDI0MDMzMSUyRnVzLWVhc3QtMSUyRnMzJTJGYXdzNF9yZXF1ZXN0JlgtQW16LURhdGU9MjAyNDAzMzFUMTYzNjM0WiZYLUFtei1FeHBpcmVzPTMwMCZYLUFtei1TaWduYXR1cmU9YjdlZjJmNzM3Zjc2YTBlNTNjMzllOTI5MDBhYjJiMjBjNDNlZDlhOWUyZDFkZjBkYjE2YWI2OWEwMTJhMjYyMiZYLUFtei1TaWduZWRIZWFkZXJzPWhvc3QmYWN0b3JfaWQ9MCZrZXlfaWQ9MCZyZXBvX2lkPTAifQ.3G23JNp-RiRqXf5B7MwSrZykWfM_6-DSgXR2QJfKzCg)

## Implementation

The implementation leverages [SVG filters](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter) to create the texture blending effect. Details about SVG filters can be found on [Mozilla Developer Network (MDN)](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/filter).

### 1. Distort the text

The text distortion and blending are achieved using a series of SVG filter primitives:

- feImage: Load the photo as the first input.
- feColorMatrix: Convert the photo to grayscale to enhance the contrast for the distorting effect.
  ```
    type="saturate"
  ```
- feDisplacementMap: Use the grayscale photo to distort the text.
- feColorMatrix: Apply transparency to the text for better blending.
  ```
    type="matrix"
    values="1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 0.9 0"
  ```
- feImage: Load the photo again for the blending effect.
- feBlend: Blend the distorted text with the photo.
  ```
    mode="multiply"
  ```

### 2. Apply the svg filter to the text

Position and apply the SVG filter to the text element within the SVG:

```svelte
<svg ...>
  <defs ...></defs>
  <text
    x="50%"
    y="68%"
    font-size="{$fontSize}rem"
    font-weight="bold"
    text-anchor="middle"
    alignment-baseline="middle"
    fill={$color}
    filter="url(#blend-svelte)"
  >
    {$text}
  </text>
</svg>
```

### 3. Fill the Textured Text with the Photo

```svelte
<svg ...>
  <image
    href={$background.src}
    x="0"
    y="0"
    width="100%"
    height="100%"
    preserveAspectRatio="none"
  />
  <text ...></text>
</svg>
```
