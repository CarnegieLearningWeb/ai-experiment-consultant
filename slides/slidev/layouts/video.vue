<template>
  <div class="slidev-layout cl-video-layout">
    <slot />
  </div>
</template>

<style scoped>
.cl-video-layout {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
  background: #000;
}

.cl-video-layout :deep(video) {
  display: block;
  width: 100%;
  height: 100%;
  background: #000;
  object-fit: contain;
}
</style>
