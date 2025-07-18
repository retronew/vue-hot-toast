import {
  defineConfig,
  presetWind4,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
  shortcuts: {
    'btn': 'relative overflow-hidden inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-zinc-300 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100',
    'btn-sm': 'relative overflow-hidden text-xs px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100',
    'btn-success': 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700',
    'btn-secondary': 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-50 text-zinc-900 dark:text-zinc-100',
    'btn-danger': 'bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700',
  },
  content: {
    pipeline: {
      include: [
        // the default
        /\.(vue|[jt]sx|mdx?|html)($|\?)/,
        // include js/ts files
        'src/**/*.{js,ts}',
      ],
      // exclude files
      exclude: [],
    },
  },
  transformers: [
    transformerVariantGroup(),
  ],
})
