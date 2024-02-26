import { deleteAsync } from 'del'

import type { Options as DelOptions } from 'del'
import type { Plugin } from 'rollup'

export interface Options extends DelOptions {
  /**
   * Rollup hook the plugin should use.
   * @default 'buildStart'
   */
  readonly hook?: string

  /**
   * Delete items once. Useful in watch mode.
   * @default false
   */
  readonly runOnce?: boolean

  /**
   * Patterns of files and folders to be deleted.
   * @default []
   */
  readonly targets?: string | ReadonlyArray<string>

  /**
   * Outputs removed files and folders to console.
   * @default false
   */
  readonly verbose?: boolean
}

export function del(options: Options = {}): Plugin {
  const {
    hook = 'buildStart',
    runOnce = false,
    targets = [],
    verbose = false,
    ...rest
  } = options

  let deleted = false

  return {
    name: 'kinetic-cafe-delete',
    [hook]: async () => {
      if (runOnce && deleted) {
        return
      }

      const paths = await deleteAsync(targets, rest)

      if (verbose || rest.dryRun) {
        const message = rest.dryRun
          ? `Expected files and folders to be deleted: ${paths.length}`
          : `Deleted files and folders: ${paths.length}`

        console.log(message)

        for (const path of paths) {
          console.log(path)
        }
      }

      deleted = true
    },
  }
}
