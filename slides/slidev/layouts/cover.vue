<!--
  Carnegie Learning cover layout (overrides Slidev's built-in `cover`), used by
  slide 1. Modeled on assets/reference/title.png:
    - CL logo upper-left
    - Hepta Slab title hierarchy + Roboto Light subtitle / presenter info (the
      slide's own markdown, rendered via <slot/> — wording unchanged)
    - powder-blue field on the right with the reference's 2×2 icon mosaic
    - a lavender lower-third band along the bottom-left
-->
<script setup>
import logoUrl from '../assets/logo/carnegielearning.png'
import titleReferenceUrl from '../assets/reference/title.png'
</script>

<template>
  <div class="slidev-layout cl-cover">
    <div class="cl-cover-field">
    </div>

    <div
      class="cl-cover-reference-art"
      :style="{ backgroundImage: `url(${titleReferenceUrl})` }"
      aria-hidden="true"
    ></div>

    <div class="cl-cover-band" aria-hidden="true"></div>

    <img class="cl-cover-logo" :src="logoUrl" alt="Carnegie Learning" />

    <div class="cl-cover-content">
      <slot />
    </div>

    <footer class="cl-cover-footer">© 2026 Carnegie Learning, Inc.</footer>
  </div>
</template>

<style>
.slidev-layout.cl-cover {
  position: relative;
  padding: 0;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

.cl-cover-field {
  position: absolute;
  top: 0;
  right: 0;
  width: 37.7%;
  height: 100%;
  background: var(--cl-sky, #cbe1f5);
}

.cl-cover-reference-art {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 37.7%;
  height: 66.6667%;
  background-repeat: no-repeat;
  background-position: right bottom;
  /* The source artwork begins its tile grid one pixel inside the sky field.
     A tiny horizontal overscale aligns that first tile pixel to our boundary. */
  background-size: 984px 552px;
  z-index: 1;
}

.cl-cover-band {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 62.3%;
  height: 33.3333%;
  background: var(--cl-lavender, #b880fa);
}

.cl-cover-logo {
  position: absolute;
  top: 40px;
  left: 56px;
  width: 84px;
  height: auto;
  z-index: 3;
}

.cl-cover-content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 62.3%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 76px 24px 178px 56px;
  z-index: 2;
}
.cl-cover-content h1 {
  font-size: 2.2rem;
  line-height: 1.05;
  margin: 0 0 0.5rem;
  white-space: nowrap;
}
.cl-cover-content h4 {
  font-family: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  font-weight: 300;
  font-size: 1.05rem;
  line-height: 1.4;
  color: var(--cl-muted, #6b6e7e);
  margin: 0 0 1.4rem;
  max-width: 50ch;
}
.cl-cover-content p {
  font-family: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  margin: 0.15rem 0;
}
.cl-cover-content p strong { font-weight: 500; color: var(--cl-ink, #282a3a); }

.cl-cover-footer {
  position: absolute;
  left: 56px;
  bottom: 24px;
  font-size: 0.5rem;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--cl-ink, #282a3a);
  z-index: 3;
}
</style>
