# @kineticcafe/rollup-plugin-delete

Delete files and folders using Rollup. This is a fork of the excellent
[rollup-plugin-delete][]. The changes are mostly:

- Convert to Typescript. The previous version produces TS2349 even though the
  created type declaration file and the generated type declaration file are
  more or less the same.

## About

This plugin is useful when you want to clean `dist` or other folders and files
before bundling. It's using [del][] internally, check it for pattern examples.

## Installation

```bash
# pnpm
pnpm install -D @kineticcafe/rollup-plugin-delete

# yarn
yarn add -D @kineticcafe/rollup-plugin-delete

# npm
npm install -D @kineticcafe/rollup-plugin-delete
```

## Usage

```js
// rollup.config.js
import { del } from '@kineticcafe/rollup-plugin-delete'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/app.js',
    format: 'cjs',
  },
  plugins: [del({ targets: 'dist/*' })],
}
```

You can also remove files after the bundle has been written:

```typescript
// vite.config.ts
import * as path from 'node:path'
import { defineConfig } from 'vite'
import { del } from '@kineticcafe/rollup-plugin-delete'

const deleteIndexHtml = () =>
  del({
    targets: path.resolve(__dirname, 'dist/index.html'),
    hook: 'writeBundle',
  })

export default defineConfig({
  plugins: [deleteIndexHtml()],
})
```

### Configuration

There are some useful options:

#### `targets`

A string or an array of patterns of files and folders to be deleted. Default is
`[]`.

```js
del({ targets: 'dist/*' })

del({
  targets: ['dist/*', 'build/*'],
})
```

#### `verbose`

Output removed files and folders to console. Default is `false`.

```js
del({
  targets: 'dist/*',
  verbose: true,
})
```

> Note: use \* (wildcard character) in pattern to show removed files

#### `hook`

The [Rollup hook](https://rollupjs.org/guide/en/#build-hooks) the plugin should
use. Default is `buildStart`.

```js
del({
  targets: 'dist/*',
  hook: 'buildEnd',
})
```

#### `runOnce`

Type: `boolean` | Default: `false`

Delete items once. Useful in watch mode.

```js
del({
  targets: 'dist/*',
  runOnce: true,
})
```

All other options are passed to [del
package](https://github.com/sindresorhus/del) which is used inside.

## License

MIT

[rollup-plugin-delete]: https://github.com/vladshcherbin/rollup-plugin-delete
[del]: https://github.com/sindresorhus/del
