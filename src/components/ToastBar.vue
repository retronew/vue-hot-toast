<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { ToastBarProps, ToastPosition } from '../core/types'
import { computed, ref } from 'vue'
import { prefersReducedMotion, resolveValue } from '../core/utils'
import ToastIcon from './ToastIcon.vue'

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
  <div
    :class="$style['toast-bar']"
    :style="{
      ...animationStyle,
      ...toast.style,
    }"
  >
    <slot v-if="$slots.default" />

    <template v-else>
      <slot name="icon">
        <ToastIcon
          :type="toast.type"
          :icon="toast.icon"
          :icon-theme="toast.iconTheme"
        />
      </slot>
      <slot name="message">
        <div
          :class="$style['message-wrapper']"
          v-bind="toast.ariaProps"
        >
          {{ resolveValue(toast.message, toast) }}
        </div>
      </slot>
    </template>
  </div>
</template>

<style lang="scss" module>
.toast-bar {
  --toast-background: #fff;
  --toast-color: #363636;
  --toast-box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);

  display: flex;
  align-items: center;
  background: var(--toast-background);
  color: var(--toast-color);
  line-height: 1.3;
  will-change: transform;
  box-shadow: var(--toast-box-shadow);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;

  @media (prefers-color-scheme: dark) {
    --toast-background: #1a1a1a;
    --toast-color: #e5e5e5;
    --toast-box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4), 0 3px 3px rgba(0, 0, 0, 0.2);
  }
}

.message-wrapper {
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
}
</style>

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
