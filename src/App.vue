<script setup lang="ts">
import type { ToastPosition } from './index'
import { useDark, useToggle } from '@vueuse/core'
import { h, ref } from 'vue'
import toast, { Toaster } from './index'

const isDark = useDark()
const toggleDark = useToggle(isDark)

const positions: ToastPosition[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right']
const position = ref<ToastPosition>('top-center')

const directions = [true, false]
const direction = ref(true)

const statusMessage = ref('Component loaded successfully! 🚀')

function handleRipple(event: MouseEvent) {
  const button = event.currentTarget as HTMLButtonElement
  const ripple = document.createElement('span')
  const rect = button.getBoundingClientRect()
  const size = Math.max(rect.width, rect.height)
  const x = event.clientX - rect.left - size / 2
  const y = event.clientY - rect.top - size / 2

  ripple.style.width = ripple.style.height = `${size}px`
  ripple.style.left = `${x}px`
  ripple.style.top = `${y}px`
  ripple.classList.add('ripple')

  button.appendChild(ripple)

  setTimeout(() => {
    ripple.remove()
  }, 600)
}

function handleDirectionChange(event: MouseEvent, newDirection: boolean) {
  handleRipple(event)
  direction.value = newDirection
  toast(`Toast direction set to ${newDirection ? 'ltr' : 'rtl'}`, {
    icon: h('span', { class: 'text-2xl' }, '↔️'),
  })
}

function handlePositionChange(event: MouseEvent, newPosition: ToastPosition) {
  handleRipple(event)
  position.value = newPosition
  toast(`Toast position set to ${newPosition}`, {
    icon: h('span', { class: 'text-2xl' }, '📍'),
  })
}

function formatPositionName(pos: string) {
  return pos.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function handleSuccessClick(event: MouseEvent) {
  handleRipple(event)
  toast.success('Operation completed successfully!')
}

function handleErrorClick(event: MouseEvent) {
  handleRipple(event)
  toast.error('Something went wrong. Please try again.')
}

function handleInfoClick(event: MouseEvent) {
  handleRipple(event)
  toast('Here is some information for you.')
}

function handleLoadingClick(event: MouseEvent) {
  handleRipple(event)
  const toastId = toast.loading('Processing your request...')
  setTimeout(() => {
    toast.success('Process completed!', { id: toastId })
  }, 2000)
}

function handlePromiseClick(event: MouseEvent) {
  handleRipple(event)
  const promise = () => new Promise((resolve, reject) =>
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve({ name: 'Project' })
      }
      else {
        reject(new Error('Error'))
      }
    }, 2000),
  )

  toast.promise(promise, {
    loading: 'Saving data...',
    success: 'Success: Project saved!',
    error: 'Error: Project not saved!',
  })
}

function handleCustomClick(event: MouseEvent) {
  handleRipple(event)
  toast.custom((t: any) =>
    h(
      'div',
      {
        class: [
          'flex items-center gap-3',
          isDark.value
            ? 'bg-linear-to-r from-violet-600 to-purple-600'
            : 'bg-linear-to-r from-violet-500 to-purple-500',
          'text-white px-6 py-4 rounded-lg shadow-xl',
        ].join(' '),
      },
      [
        h('span', { class: 'text-2xl' }, '🎉'),
        h('div', [
          h('p', { class: 'font-semibold' }, 'Welcome to Vanilla Hot Toast!'),
          h(
            'p',
            { class: 'text-sm opacity-90' },
            `Beautiful notifications that adapt to ${isDark.value ? 'dark' : 'light'} mode`,
          ),
        ]),
        h(
          'button',
          {
            class: 'ml-auto text-white/80 hover:text-white',
            onClick: () => toast.dismiss(t.id),
          },
          [
            h(
              'svg',
              {
                class: 'w-5 h-5',
                fill: 'none',
                stroke: 'currentColor',
                viewBox: '0 0 24 24',
              },
              [
                h('path', {
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  'stroke-width': '2',
                  'd': 'M6 18L18 6M6 6l12 12',
                }),
              ],
            ),
          ],
        ),
      ],
    ))
}

function handleDismissAllClick(event: MouseEvent) {
  handleRipple(event)
  toast.dismiss()
}
</script>

<template>
  <Toaster
    :position="position"
    :reverse-order="direction"
  />

  <div class="text-zinc-900 p-4 bg-zinc-50 flex min-h-screen transition-colors duration-300 items-center justify-center dark:text-zinc-50 dark:bg-zinc-950">
    <div class="max-w-2xl w-full space-y-8">
      <div class="relative">
        <button
          class="p-2 border border-zinc-200 rounded-lg bg-white transition-colors right-0 top-0 absolute dark:border-zinc-800 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Toggle theme"
          @click="handleRipple($event); toggleDark()"
        >
          <svg
            v-if="!isDark"
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          /></svg>
          <svg
            v-else
            class="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          ><path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          /></svg>
        </button>

        <div class="text-center space-y-2">
          <h1 class="text-4xl text-transparent tracking-tight font-semibold from-zinc-900 to-zinc-600 bg-linear-to-r bg-clip-text dark:from-zinc-100 dark:to-zinc-400">
            Vue Hot Toast
          </h1>
          <p class="text-lg text-zinc-500 dark:text-zinc-400">
            Smoking hot notifications for Vue.js
          </p>
        </div>
      </div>

      <div class="text-zinc-900 border border-zinc-200 rounded-lg bg-white shadow-sm dark:text-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        <div class="p-6 space-y-6">
          <div class="space-y-2">
            <h2 class="text-xl font-medium">
              Toast Notifications
            </h2>
            <p class="text-sm text-zinc-500 dark:text-zinc-400">
              Click any button below to see different toast styles.
            </p>
          </div>

          <div class="gap-3 grid grid-cols-2 md:grid-cols-3">
            <button
              class="btn btn-success"
              @click="handleSuccessClick"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg>
              Success
            </button>
            <button
              class="btn btn-danger"
              @click="handleErrorClick"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg>
              Error
            </button>
            <button
              class="btn btn-secondary"
              @click="handleInfoClick"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg>
              Info
            </button>
            <button
              class="btn btn-secondary"
              @click="handleLoadingClick"
            >
              <svg
                class="mr-2 h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              ><circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
                class="opacity-25"
              /><path
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                class="opacity-75"
              /></svg>
              Loading
            </button>
            <button
              class="btn text-zinc-50 bg-violet-600 dark:bg-violet-600 hover:bg-violet-600/90 dark:hover:bg-violet-600/90"
              @click="handlePromiseClick"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              /></svg>
              Promise
            </button>
            <button
              class="btn text-zinc-50 from-violet-600 to-indigo-600 bg-linear-to-r hover:from-violet-600/90 hover:to-indigo-600/90"
              @click="handleCustomClick"
            >
              <svg
                class="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              /></svg>
              Custom
            </button>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 class="text-sm font-medium mb-3">
              Toast Positions
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="pos in positions"
                :key="pos"
                class="btn-sm text-zinc-700 bg-zinc-100 dark:text-zinc-200 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                :class="{ 'bg-zinc-200 dark:bg-zinc-700 font-semibold': position === pos }"
                @click="handlePositionChange($event, pos)"
              >
                {{ formatPositionName(pos) }}
              </button>
            </div>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 class="text-sm font-medium mb-3">
              Toast Direction
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="dir in directions"
                :key="dir.toString()"
                class="btn-sm text-zinc-700 bg-zinc-100 dark:text-zinc-200 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                :class="{ 'bg-zinc-200 dark:bg-zinc-700 font-semibold': direction === dir }"
                @click="handleDirectionChange($event, dir)"
              >
                {{ dir ? 'ltr' : 'rtl' }}
              </button>
            </div>
          </div>

          <div class="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <h3 class="text-sm font-medium mb-3">
              Actions
            </h3>
            <div class="flex flex-wrap gap-2">
              <button
                class="btn-sm text-zinc-700 bg-zinc-100 dark:text-zinc-200 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                @click="handleDismissAllClick"
              >
                Dismiss All
              </button>
            </div>
          </div>
        </div>
        <div class="px-6 py-4 border-t border-zinc-200 rounded-b-lg bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <p class="text-xs text-zinc-500 text-center dark:text-zinc-400">
            Toast notifications automatically adapt to your theme.
          </p>
        </div>
      </div>
      <div class="text-xs text-zinc-500 text-center dark:text-zinc-400">
        <p>{{ statusMessage }}</p>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
  --ripple-bg: rgba(0, 0, 0, 0.1);
}

.dark {
  --ripple-bg: rgba(255, 255, 255, 0.15);
}

body {
  font-family:
    'Inter',
    system-ui,
    -apple-system,
    sans-serif;
}

.ripple {
  position: absolute;
  border-radius: 50%;
  background-color: var(--ripple-bg);
  transform: scale(0);
  animation: ripple 0.6s ease-out;
  pointer-events: none;
}

@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
</style>
