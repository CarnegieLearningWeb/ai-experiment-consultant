<!--
  Carnegie Learning content-slide layout (overrides Slidev's built-in `default`).
  Applies to every content slide automatically — no per-slide frontmatter needed.

  Frame: eyebrow (top-left) · slide content · footer (copyright + page number) ·
  right-edge brand band with a geometric tile.

  The frame's structural CSS lives in this component's <style> block (so it always
  loads with the layout, even on HMR). Global brand type/color tokens live in
  ../style.css. Color tokens are referenced with fallbacks so the frame never
  collapses if the global sheet is momentarily absent.

  Per-slide overrides (optional, for later steps):
    eyebrow: Custom label   # frontmatter on a slide
-->
<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'
import tileUrl from '../assets/icon/universal1.png'

const { $frontmatter, $page } = useSlideContext()
const eyebrow = computed(() => $frontmatter.eyebrow || 'AI Experiment Consultant')
</script>

<template>
  <div class="slidev-layout cl-default">
    <aside class="cl-rail">
      <img :src="tileUrl" width="68" height="68" alt="" aria-hidden="true" />
    </aside>

    <header class="cl-eyebrow">{{ eyebrow }}</header>

    <div class="cl-content">
      <slot />
    </div>

    <footer class="cl-footer">
      <span>© 2026 Carnegie Learning, Inc.</span>
      <span class="cl-pageno">{{ $page }}</span>
    </footer>
  </div>
</template>

<style>
.slidev-layout.cl-default {
  display: flex;
  flex-direction: column;
  position: relative;
}

.cl-eyebrow {
  font-family: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  font-weight: 400;
  font-size: 0.82rem;
  letter-spacing: 0.04em;
  color: var(--cl-muted, #6b6e7e);
  margin-bottom: 0.5rem;
}

.cl-content {
  flex: 1 1 auto;
  min-height: 0;
  /* clear the right band: band width − base px-14 padding + gap */
  padding-right: calc(var(--cl-rail-w, 104px) - 3.5rem + 1rem);
}
.cl-content > :first-child { margin-top: 0.1rem; }

.cl-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  color: var(--cl-muted, #6b6e7e);
  text-transform: uppercase;
  padding-right: calc(var(--cl-rail-w, 104px) - 3.5rem + 1rem);
}

.cl-rail {
  position: absolute;
  top: 0;
  right: 0;
  width: var(--cl-rail-w, 104px);
  height: 100%;
  background: var(--cl-sky, #cbe1f5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}
.cl-rail img {
  width: 68px;
  height: 68px;
  display: block;
}
</style>
