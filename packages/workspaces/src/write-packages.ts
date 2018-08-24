import { writeFile } from 'fs'
import { promisify } from 'util'
import { isDependencyObject, TBumpStack, TPackageJson } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writePackages = async (bumpStack: TBumpStack) => {
  for (const item of Object.values(bumpStack)) {
    const { default: packageJson }: { default: TPackageJson } = await import(item.path)

    if (item.version !== null) {
      packageJson.version = item.version
    }

    if (item.deps !== null && isDependencyObject(packageJson.dependencies)) {
      for (const [depName, depRange] of Object.entries(item.deps)) {
        packageJson.dependencies[depName] = depRange
      }
    }

    if (item.devDeps !== null && isDependencyObject(packageJson.devDependencies)) {
      for (const [depName, depRange] of Object.entries(item.devDeps)) {
        packageJson.devDependencies[depName] = depRange
      }
    }

    const packageData = JSON.stringify(packageJson, null, 2)

    await pWriteFile(item.path, packageData, { encoding: 'utf8' })
  }
}
