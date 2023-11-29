import autoExternal from 'rollup-plugin-auto-external'

/** @returns {import("rollup").RollupOptions} */
export default [
  {
    input: 'lib/index.js',
    output: [
      {
        file: 'dist/index.mjs',
        exports: 'auto',
        format: 'es',
        generatedCode: { constBindings: true },
      },
    ],
    plugins: [autoExternal()],
  },
]
