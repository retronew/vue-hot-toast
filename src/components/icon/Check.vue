<script setup lang="ts">
import type { IconTheme } from '../../core/types'

withDefaults(defineProps<IconTheme>(), {
  primary: '#61d345',
  secondary: '#fff',
  darkPrimary: '#4ade80',
  darkSecondary: '#1a1a1a',
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
@keyframes circleAnimation {
  from {
    transform: scale(0) rotate(45deg);
    opacity: 0;
  }
  to {
    transform: scale(1) rotate(45deg);
    opacity: 1;
  }
}

@keyframes checkAnimation {
  0% {
    height: 0;
    width: 0;
    opacity: 0;
  }
  40% {
    height: 0;
    width: 6px;
    opacity: 1;
  }
  100% {
    opacity: 1;
    height: 10px;
  }
}

.icon {
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: var(--primary);
  position: relative;
  transform: rotate(45deg);
  animation: circleAnimation 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  animation-delay: 100ms;

  &:after {
    content: '';
    box-sizing: border-box;
    animation: checkAnimation 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: var(--secondary);
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }

  @media (prefers-color-scheme: dark) {
    background: var(--dark-primary);

    &:after {
      border-color: var(--dark-secondary);
    }
  }
}
</style>
