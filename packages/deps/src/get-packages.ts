import getPackageDirs from './get-package-dirs'
import { TPackageJson, TPackages } from './types'

const getPackages = async () => {
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

export default getPackages
