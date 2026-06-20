<!--
  Carnegie Learning closing layout, used by the final Thank-you slide.
  Modeled on assets/reference/thank-you.png:
    - CL logo upper-left
    - large Hepta Slab "Thank you" + Questions / links (the slide's own markdown
      via <slot/> — wording and links unchanged)
    - the reference's full-height right strip of 3 brand icons
    - a powder-blue lower-third band aligned to the lowest icon
-->
<script setup>
import logoUrl from '../assets/logo/carnegielearning.png'
import thanksReferenceUrl from '../assets/reference/thank-you.png'
</script>

<template>
  <div class="slidev-layout cl-thanks">
    <div
      class="cl-thanks-strip"
      :style="{ backgroundImage: `url(${thanksReferenceUrl})` }"
      aria-hidden="true"
    ></div>

    <div class="cl-thanks-band" aria-hidden="true"></div>

    <img class="cl-thanks-logo" :src="logoUrl" alt="Carnegie Learning" />

    <div class="cl-thanks-content">
      <slot />
    </div>

    <footer class="cl-thanks-footer">© 2026 Carnegie Learning, Inc.</footer>
  </div>
</template>

<style>
.slidev-layout.cl-thanks {
  position: relative;
  padding: 0;
  height: 100%;
  background: #fff;
  overflow: hidden;
}

.cl-thanks-strip {
  position: absolute;
  top: 0;
  right: 0;
  width: 18.75%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: right top;
  background-size: 980px 552px;
}

.cl-thanks-band {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 81.25%;
  height: 33.3333%;
  background: var(--cl-sky, #cbe1f5);
}

.cl-thanks-logo {
  position: absolute;
  top: 40px;
  left: 56px;
  width: 84px;
  height: auto;
  z-index: 3;
}

.cl-thanks-content {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 79%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 28px 64px 56px;
  z-index: 2;
}
.cl-thanks-content h1 {
  font-size: 4rem;
  line-height: 1;
  margin: 0 0 0.8rem;
}
.cl-thanks-content h3 {
  font-family: 'Hepta Slab', ui-serif, Georgia, serif;
  font-weight: 400;
  font-size: 1.4rem;
  margin: 0 0 1rem;
  color: var(--cl-ink, #282a3a);
}
.cl-thanks-content p {
  font-family: 'Roboto', ui-sans-serif, system-ui, sans-serif;
  font-size: 0.95rem;
  margin: 0.3rem 0;
}
.cl-thanks-content a {
  color: var(--cl-blue, #4264d9);
  text-decoration: none;
  border-bottom: 1px solid rgba(66, 100, 217, 0.35);
}

.cl-thanks-footer {
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
