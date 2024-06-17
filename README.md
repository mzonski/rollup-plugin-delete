# @kineticcafe/rollup-plugin-delete

A Rollup plugin to delete files and folders during the build process. This is
a fork of the excellent [`rollup-plugin-delete`][rpd]. The changes are:

- Convert to Typescript. The previous version produces `TS2349` even though the
  created type declaration file and the generated type declaration file are
  more or less the same.

- Removing [`del`][del], which depends on outdated versions of
  [`globby`][globby] and [`rimraf`][rimraf].

## About

This plugin is useful when you want to clean `dist` or other folders and files
before bundling. Targets use [`minimatch` pattern matching][minimatch], so
review the documentation for patterns.

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

```javascript
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

You can also remove files after the bundle has been written by changing the
`hook`:

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

| Name          | Type                   | Default       | Purpose                                                                                |
| ------------- | ---------------------- | ------------- | -------------------------------------------------------------------------------------- |
| `targets`     | `string` \| `string[]` | []            | A string or an array of patterns of files and folders to be deleted.                   |
| `verbose`     | `boolean`              | `false`       | Output removed files and folders to console. Default is `false`.                       |
| `hook`        | `string`               | `buildStart`  | The [Rollup hook](https://rollupjs.org/guide/en/#build-hooks) the plugin should use.   |
| `runOnce`     | `boolean`              | `false`       | Delete items once. Useful in watch mode.                                               |
| `dryRun`      | `boolean`              | `false`       | Does not remove the files, but reports what would be removed. Implies `verbose: true`. |
| `concurrency` | `number`               | `Infinity`    | Concurrency limit. Minimum `1`.                                                        |
| `cwd`         | `string`               | `process.cwd` | The current working directory in which to search.                                      |

All other options are inherited from `globby`, but [`expandDirectories`][ed],
[`onlyFiles`][of], and [`followSymbolicLinks`][fsl] default to `false`.

#### Examples

```javascript
del({ targets: 'dist/*' })
del({ targets: ['dist/*', 'build/*'] })
del({ targets: 'dist/*', verbose: true })
del({ targets: 'dist/*', hook: 'buildEnd' })
del({ targets: 'dist/*', runOnce: true })
del({ targets: 'dist/*', dryRun: true })
```

> Note: use `*` (wildcard character) in the pattern to show removed files.

## License

MIT

[rpd]: https://github.com/vladshcherbin/rollup-plugin-delete
[del]: https://github.com/sindresorhus/del
[rimraf]: https://github.com/isaacs/rimraf
[globby]: https://github.com/sindresorhus/globby
[minimatch]: https://github.com/isaacs/minimatch#features
[ed]: https://github.com/sindresorhus/globby?tab=readme-ov-file#expanddirectories
[of]: https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#onlyfiles
[fsl]: https://github.com/mrmlnc/fast-glob?tab=readme-ov-file#followsymboliclinks
