<!--
  Carnegie Learning content-slide layout (overrides Slidev's built-in `default`).
  Applies to every content slide automatically — no per-slide frontmatter needed.

  Frame: eyebrow (top-left) · slide content (full width) · footer (copyright +
  page number).

  Frame CSS lives in this component's <style> block so it always loads with the
  layout (HMR-safe). Global brand type/color tokens live in ../style.css; colors
  are referenced with fallbacks so the frame never collapses without that sheet.

  Per-slide overrides (optional):
    eyebrow: Custom label   # frontmatter on a slide
    hideFooter: true        # for media-heavy slides that need the lower edge
-->
<script setup>
import { computed } from 'vue'
import { useSlideContext } from '@slidev/client'

const { $frontmatter, $page } = useSlideContext()
const eyebrow = computed(() => $frontmatter.eyebrow || 'AI Experiment Consultant')
</script>

<template>
  <div class="slidev-layout cl-default">
    <header class="cl-eyebrow">{{ eyebrow }}</header>

    <div class="cl-content">
      <slot />
    </div>

    <footer v-if="!$frontmatter.hideFooter" class="cl-footer">
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
}
.cl-content > :first-child { margin-top: 0.1rem; }

.cl-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.5rem;
  letter-spacing: 0.03em;
  color: var(--cl-muted, #6b6e7e);
  text-transform: uppercase;
}
</style>
