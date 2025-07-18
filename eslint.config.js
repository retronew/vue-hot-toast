import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',

    stylistic: {
      indent: 2,
      quotes: 'single',
    },

    unocss: true,
    formatters: true,

    typescript: true,
    vue: true,

    ignores: [
      'tsconfig.json',
      'tsconfig.*.json',
    ],
  },
  {
    rules: {
      'no-console': 'off',
      'vue/max-attributes-per-line': ['error', {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      }],
      'vue/no-deprecated-slot-attribute': 'off',
    },
  },
)
