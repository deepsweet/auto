import { getPackageDirs } from './get-package-dirs'
import { TPackages } from './types'
import { TPackageJson } from '@auto/utils/src/'

export const getPackages = async () => {
  const dirs = await getPackageDirs()

  return dirs.reduce(
    async (prev, dir) => {
      const packages = await prev
      const packagePath = `${dir}/package.json`
      const packageJson: TPackageJson = await import(packagePath)

      packages[packageJson.name] = {
        path: packagePath,
        json: packageJson
      }

      return packages
    },
    Promise.resolve({} as TPackages)
  )
}
