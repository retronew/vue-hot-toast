import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'unplugin-dts/vite'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  const isLib = mode === 'lib'

  return {
    build: isLib
      ? {
          lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'VueHotToast',
            fileName: 'index',
          },
          rollupOptions: {
            external: ['vue'],
            output: {
              globals: {
                vue: 'Vue',
              },
              exports: 'named',
            },
          },
        }
      : {},

    plugins: [
      vue(),
      UnoCSS(),
      ...(isLib
        ? [dts({
            insertTypesEntry: true,
            bundleTypes: true,
            tsconfigPath: './tsconfig.app.json',
          })]
        : []),
    ],

    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },
  }
})
