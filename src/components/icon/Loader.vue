<script setup lang="ts">
import type { IconTheme } from '../../core/types'

withDefaults(defineProps<IconTheme>(), {
  primary: '#616161',
  secondary: '#e0e0e0',
  darkPrimary: '#a3a3a3',
  darkSecondary: '#404040',
})
</script>

<template>
  <div
    :class="$style.icon"
    :style="{
      '--primary': primary,
      '--secondary': secondary,
      '--dark-primary': darkPrimary,
      '--dark-secondary': darkSecondary,
    }"
  />
</template>

<style lang="scss" module>
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.icon {
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: var(--secondary);
  border-right-color: var(--primary);
  animation: rotate 1s linear infinite;

  @media (prefers-color-scheme: dark) {
    border-color: var(--dark-secondary);
    border-right-color: var(--dark-primary);
  }
}
</style>
