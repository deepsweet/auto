import { TPackages } from '@auto/utils/src/'
import { getWorkspacesPackageDirs } from './get-workspaces-package-dirs'
import { getPackage } from './get-package'

export const getWorkspacesPackages = async () => {
  const dirs = await getWorkspacesPackageDirs()

  return dirs.reduce(
    async (prev, dir) => {
      const packages = await prev
      const packageJson = await getPackage(dir)

      packages[packageJson.name] = {
        dir,
        json: packageJson
      }

      return packages
    },
    Promise.resolve({} as TPackages)
  )
}
