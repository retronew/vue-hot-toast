<script setup lang="ts">
import type { ToastIconProps } from '../core/types'
import CheckIcon from './icon/Check.vue'
import ErrorIcon from './icon/Error.vue'
import LoaderIcon from './icon/Loader.vue'

defineProps<ToastIconProps>()
</script>

<template>
  <component
    v-bind="icon"
    :is="icon"
    v-if="icon"
  />

  <div v-else-if="type === 'blank'" />

  <div
    v-else
    :class="$style['indicator-wrapper']"
  >
    <LoaderIcon v-bind="iconTheme" />

    <div
      v-if="type !== 'loading'"
      :class="$style['status-wrapper']"
    >
      <ErrorIcon
        v-if="type === 'error'"
        v-bind="iconTheme"
      />
      <CheckIcon
        v-else
        v-bind="iconTheme"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
.indicator-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
}

.status-wrapper {
  position: absolute;
}
</style>
