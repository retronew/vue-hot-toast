<script setup lang="ts">
import type { Toast, ToasterProps, ToastPosition } from '../core/types'
import useToaster from '../core/useToaster'
import { prefersReducedMotion, resolveValue } from '../core/utils'
import HeadlessToastBar from './HeadlessToastBar.vue'
import ToastBar from './ToastBar.vue'
import ToastWrapper from './ToastWrapper.vue'

const props = withDefaults(defineProps<ToasterProps>(), {
  position: 'top-center',
  reverseOrder: true,
  gutter: 8,
  offset: 16,
})

const { toasts, handlers } = useToaster(props.toastOptions)

function getWrapperPosition(
  toast: Toast,
  position: ToastPosition,
): Partial<CSSStyleDeclaration> {
  return getPositionStyle(position, handlers.calculateOffset(toast, {
    reverseOrder: props.reverseOrder,
    gutter: props.gutter,
    defaultPosition: props.position,
  }))
}

function getPositionStyle(
  position: ToastPosition,
  offset: number,
): Partial<CSSStyleDeclaration> {
  const isTop = position.includes('top')
  const isCenter = position.includes('center')
  const isRight = position.includes('right')

  return {
    left: '0',
    right: '0',
    display: 'flex',
    position: 'absolute',
    ...(prefersReducedMotion()
      ? {}
      : { transition: 'all 230ms cubic-bezier(.21,1.02,.73,1)' }),
    transform: `translateY(${offset * (isTop ? 1 : -1)}px)`,
    ...(isTop ? { top: '0' } : { bottom: '0' }),
    ...(isCenter && { justifyContent: 'center' }),
    ...(isRight && !isCenter && { justifyContent: 'flex-end' }),
  }
}
</script>

<template>
  <div
    id="_vht_toaster"
    :class="$style.toaster"
    :style="{
      '--toaster-offset': offset ? `${offset}px` : '0',
    }"
    @mouseenter="handlers.startPause"
    @mouseleave="handlers.endPause"
  >
    <ToastWrapper
      v-for="toast in toasts"
      :id="toast.id"
      :key="toast.id"
      :class="{ [$style.active]: toast.visible }"
      :style="getWrapperPosition(toast, toast.position || position)"
      @height-update="handlers.updateHeight"
    >
      <template v-if="toast.type === 'custom'">
        <HeadlessToastBar
          :toast="toast"
          :position="toast.position || position"
        >
          <component :is="resolveValue(toast.message, toast)" />
        </HeadlessToastBar>
      </template>

      <template v-else-if="$slots.default">
        <slot
          :toast="toast"
          :position="toast.position || position"
        />
      </template>

      <template v-else>
        <ToastBar
          :toast="toast"
          :position="toast.position || position"
        />
      </template>
    </ToastWrapper>
  </div>
</template>

<style lang="scss" module>
.toaster {
  position: fixed;
  z-index: 9999;
  inset: var(--toaster-offset);
  pointer-events: none;
}

.active {
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
}
</style>
