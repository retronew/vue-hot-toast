<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ToastBarProps, ToastPosition } from '../core/types'
import { computed, ref } from 'vue'
import { prefersReducedMotion } from '../core/utils'

const props = defineProps<ToastBarProps>()

const enterFactor = ref('0%')
const exitFactor = ref('0%')

const animationStyle = computed(() => {
  return props.toast.height
    ? getAnimationStyle(
        props.position || props.toast.position || 'top-center',
        props.toast.visible,
      )
    : { opacity: 0 }
})

function getAnimationStyle(
  position: ToastPosition,
  visible: boolean,
): CSSProperties {
  const top = position.includes('top')
  const factor = top ? 1 : -1
  const hasReduce = prefersReducedMotion()

  if (!hasReduce) {
    enterFactor.value = `${factor * -200}%`
    exitFactor.value = `${factor * -150}%`
  }

  const [enter, exit] = hasReduce
    ? ['toastFadeInAnimation', 'toastFadeOutAnimation']
    : [`toastEnterAnimation`, `toastExitAnimation`]

  return {
    '--enterFactor': enterFactor.value,
    '--exitFactor': exitFactor.value,

    'animation': visible
      ? `${enter} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`
      : `${exit} 0.4s cubic-bezier(.06,.71,.55,1) forwards`,
  }
}
</script>

<template>
  <div :style="animationStyle">
    <slot />
  </div>
</template>

<style>
@keyframes toastFadeInAnimation {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes toastFadeOutAnimation {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes toastEnterAnimation {
  0% {
    transform: translate3d(0, var(--enterFactor), 0) scale(0.6);
    opacity: 0.5;
  }
  100% {
    transform: translate3d(0, 0, 0) scale(1);
    opacity: 1;
  }
}

@keyframes toastExitAnimation {
  0% {
    transform: translate3d(0, 0, -1px) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, var(--exitFactor), -1px) scale(0.6);
    opacity: 0;
  }
}
</style>
