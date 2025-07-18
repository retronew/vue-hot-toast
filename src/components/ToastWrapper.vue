<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue'

interface ToastWrapperProps {
  id: string
}

const props = defineProps<ToastWrapperProps>()

const emit = defineEmits<{
  (e: 'heightUpdate', id: string, height: number): void
}>()

const wrapperRef = useTemplateRef<HTMLDivElement>('wrapperRef')

let observer: MutationObserver | null = null

function updateHeight() {
  if (wrapperRef.value) {
    const height = wrapperRef.value.getBoundingClientRect().height
    emit('heightUpdate', props.id, height)
  }
}

onMounted(() => {
  if (wrapperRef.value) {
    updateHeight()

    observer = new MutationObserver(updateHeight)
    observer.observe(wrapperRef.value, {
      subtree: true,
      childList: true,
      characterData: true,
    })
  }
})

onUnmounted(() => {
  if (observer)
    observer.disconnect()
})
</script>

<template>
  <div ref="wrapperRef">
    <slot />
  </div>
</template>
