# Vue Hot Toast

Smoking hot notifications for Vue.js

## Features

- ⚡️ Lightweight and fast
- 🎨 Beautiful, theme-adaptive toasts (light/dark)
- 🧩 Fully customizable (icons, styles, positions)
- 🔄 Promise & async support
- 🦾 Accessible (ARIA live regions)
- 🪶 No dependencies, headless & styled components

## Installation

```bash
npm install @retronew/vue-hot-toast
# or
yarn add @retronew/vue-hot-toast
# or
pnpm add @retronew/vue-hot-toast
```

## Usage

1. **Register the Toaster component** (usually in your root component):

```vue
<script setup>
import { Toaster } from '@retronew/vue-hot-toast'
</script>

<template>
  <Toaster />
  <!-- ...your app -->
</template>
```

2. **Show a toast anywhere in your app:**

```ts
import toast from '@retronew/vue-hot-toast'

toast('Hello, world!')
toast.success('Operation completed successfully!')
toast.error('Something went wrong.')
toast.loading('Loading...')
```

3. **Promise usage:**

```ts
toast.promise(
  fetch('/api/data'),
  {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Could not load data',
  }
)
```

4. **Custom toast:**

```ts
toast.custom(t => h('div', { class: 'my-toast' }, 'Custom content'))
```

5. **Position & direction:**

```vue
<Toaster position="top-center" :reverse-order="true" />
```

## API

### Toast Positions

- `top-left`, `top-center`, `top-right`
- `bottom-left`, `bottom-center`, `bottom-right`

### Toast Methods

- `toast(message, options?)`
- `toast.success(message, options?)`
- `toast.error(message, options?)`
- `toast.loading(message, options?)`
- `toast.custom(renderFn, options?)`
- `toast.promise(promise, { loading, success, error }, options?)`
- `toast.dismiss(id?)` — Dismiss a toast or all toasts
- `toast.remove(id?)` — Remove a toast or all toasts

### Toaster Props

- `position` — Toast position (default: `top-center`)
- `reverseOrder` — Show newest on top (default: `true`)
- `gutter` — Space between toasts (default: `8`)
- `offset` — Distance from screen edge (default: `16`)
- `toastOptions` — Default options for all toasts

## Contributing

1. Fork this repo
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -am 'feat: add new feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

## License

[MIT](./LICENSE)
