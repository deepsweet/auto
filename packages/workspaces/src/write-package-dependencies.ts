import { writeFile } from 'fs'
import { promisify } from 'util'
import { isDependencyObject, TBumpStackItem, TPackageJson } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writePackageDependencies = async (bumpStackItem: TBumpStackItem) => {
  if (bumpStackItem.deps !== null || bumpStackItem.devDeps !== null) {
    const { default: packageJson }: { default: TPackageJson } = await import(bumpStackItem.path)

    if (bumpStackItem.deps !== null && isDependencyObject(packageJson.dependencies)) {
      for (const [depName, depRange] of Object.entries(bumpStackItem.deps)) {
        packageJson.dependencies[depName] = depRange
      }
    }

    if (bumpStackItem.devDeps !== null && isDependencyObject(packageJson.devDependencies)) {
      for (const [depName, depRange] of Object.entries(bumpStackItem.devDeps)) {
        packageJson.devDependencies[depName] = depRange
      }
    }

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(bumpStackItem.path, packageData, { encoding: 'utf8' })
  }
}
