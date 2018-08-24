import { writeFile } from 'fs'
import { promisify } from 'util'
import { isDependencyObject, TPackageBump, TPackageJson } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writePackageDependencies = async (packageBump: TPackageBump) => {
  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    const { default: packageJson }: { default: TPackageJson } = await import(packageBump.path)

    if (packageBump.deps !== null && isDependencyObject(packageJson.dependencies)) {
      for (const [depName, depRange] of Object.entries(packageBump.deps)) {
        packageJson.dependencies[depName] = depRange
      }
    }

    if (packageBump.devDeps !== null && isDependencyObject(packageJson.devDependencies)) {
      for (const [depName, depRange] of Object.entries(packageBump.devDeps)) {
        packageJson.devDependencies[depName] = depRange
      }
    }

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(packageBump.path, packageData, { encoding: 'utf8' })
  }
}
