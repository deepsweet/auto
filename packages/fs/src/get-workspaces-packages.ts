import { TPackages } from '@auto/utils/src/'
import { getWorkspacesPackageDirs } from './get-workspaces-package-dirs'
import { getPackage } from './get-package'
import { removeAutoNamePrefix } from './remove-auto-name-prefix'
import { TFsOptions } from './types'

export const getWorkspacesPackages = async (options: TFsOptions): Promise<TPackages> => {
  const dirs = await getWorkspacesPackageDirs()

  return dirs.reduce(
    async (prev, dir) => {
      const packages = await prev
      const packageJson = await getPackage(dir)
      const shortName = removeAutoNamePrefix(packageJson.name, options.autoNamePrefix)

      packages[shortName] = {
        dir,
        json: packageJson
      }

      return packages
    },
    Promise.resolve({} as TPackages)
  )
}
