import path from 'path'
import { getWorkspacesPackageDirs } from './get-workspaces-package-dirs'
import { TPackages } from './types'
import { TPackageJson } from '@auto/utils/src/'

export const getWorkspacesPackages = async () => {
  const dirs = await getWorkspacesPackageDirs()

  return dirs.reduce(
    async (prev, dir) => {
      const packages = await prev
      const packageJsonPath = path.join(dir, 'package.json')
      const packageJson: TPackageJson = await import(packageJsonPath)

      packages[packageJson.name] = {
        dir,
        json: packageJson
      }

      return packages
    },
    Promise.resolve({} as TPackages)
  )
}
