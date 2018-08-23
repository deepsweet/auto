import { writeFile } from 'fs'
import { promisify } from 'util'
import { TPackageJson } from '@auto/deps/src/'
import { isDependencyObject, TBumpStack } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

const writeBumps = async (bumpStack: TBumpStack) => {
  for (const item of Object.values(bumpStack)) {
    const packageJson: TPackageJson = await import(item.path)

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

export default writeBumps
