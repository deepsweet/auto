import fastGlob from 'fast-glob'
import { getPackage } from './get-package'

export const getWorkspacesPackageDirs = async () => {
  const { workspaces } = await getPackage(process.cwd())
  let globs = null

  if (typeof workspaces === 'undefined') {
    throw new Error('`workspaces` field in `package.json` is required')
  }

  if (Array.isArray(workspaces)) {
    globs = workspaces
  } else if (Array.isArray(workspaces.packages)) {
    globs = workspaces.packages
  } else {
    throw new Error('`workspaces.packages` field in `package.json` is required')
  }

  return fastGlob(globs, {
    onlyDirectories: true,
    onlyFiles: false,
    absolute: true
  }) as Promise<string[]>
}
