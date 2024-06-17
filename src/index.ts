import path from 'node:path'

import { globby } from 'globby'
import isGlob from 'is-glob'
import isPathCwd from 'is-path-cwd'
import isPathInside from 'is-path-inside'
import pMap from 'p-map'
import { rimraf } from 'rimraf'
import slash from 'slash'

import type { Options as GlobbyOptions } from 'globby'

export interface Options extends GlobbyOptions {
  /**
   * See what would be deleted.
   *
   * @default false
   *
   * @example
   * ```
   * import {deleteAsync} from 'del'
   * const deletedPaths = await deleteAsync(['temp/*.js'], {dryRun: true})
   * console.log('Files and directories that would be deleted:\n', deletedPaths.join('\n'))
   * ```
   */
  readonly dryRun?: boolean

  /**
   * Concurrency limit. Minimum: `1`.
   * @default Infinity
   */
  readonly concurrency?: number

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

import type { Plugin } from 'rollup'

const safeCheck = (file: string, cwd: string) => {
  if (isPathCwd(file)) {
    throw new Error('Cannot delete the current working directory.')
  }

  if (!isPathInside(file, cwd)) {
    throw new Error(
      'Cannot delete files/directories outside the current working directory.',
    )
  }
}

const normalizePatterns = (inPatterns: string | ReadonlyArray<string>) => {
  const patterns = Array.isArray(inPatterns) ? inPatterns : [inPatterns]

  return patterns.map((pattern) => {
    if (process.platform === 'win32' && isGlob(pattern) === false) {
      return slash(pattern)
    }

    return pattern
  })
}

const deleteAsync = async (
  inPatterns: string | ReadonlyArray<string>,
  opts: Options = {},
) => {
  const { dryRun, concurrency, cwd: cwd_, ...options } = opts

  const cwd = typeof cwd_ === 'string' ? cwd_ : process.cwd()
  const globbyOptions = {
    expandDirectories: false,
    onlyFiles: false,
    followSymbolicLinks: false,
    cwd,
    ...options,
  }

  const patterns = normalizePatterns(inPatterns)
  const paths = await globby(patterns, globbyOptions)
  const files = paths.sort((a, b) => b.localeCompare(a))

  let deletedCount = 0

  const mapper = async (name: string) => {
    const file = path.resolve(cwd, name)

    safeCheck(file, cwd)

    if (!dryRun) {
      await rimraf(file, { glob: false })
    }

    deletedCount += 1

    return file
  }

  const removedFiles = await pMap(files, mapper, { concurrency })

  removedFiles.sort((a, b) => a.localeCompare(b))

  return removedFiles
}

export function del(options: Options = {}): Plugin {
  const {
    hook = 'buildStart',
    runOnce = false,
    targets = [],
    verbose = false,
    ...deleteOptions
  } = options

  let deleted = false

  return {
    name: 'kinetic-cafe-delete',
    [hook]: async () => {
      if (runOnce && deleted) {
        return
      }

      const paths = await deleteAsync(targets, deleteOptions)

      if (verbose || deleteOptions.dryRun) {
        const message = deleteOptions.dryRun
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
