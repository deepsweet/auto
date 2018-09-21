import path from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { isDependencyObject, TWorkspacesPackageBump } from '@auto/utils/src/'
import { getPackage } from './get-package'
import { yarnInstall } from './yarn-install'
import { TFsOptions } from './types'

const pWriteFile = promisify(writeFile)

export const writePackageDependencies = async (packageBump: TWorkspacesPackageBump, options: TFsOptions) => {
  if (packageBump.deps === null && packageBump.devDeps === null) {
    return
  }

  const packageJsonPath = path.join(packageBump.dir, 'package.json')
  const packageJson = await getPackage(packageBump.dir)

  if (packageBump.deps !== null && isDependencyObject(packageJson.dependencies)) {
    for (const [depName, depRange] of Object.entries(packageBump.deps)) {
      const fullDepName = `${options.autoNamePrefix}${depName}`

      packageJson.dependencies[fullDepName] = depRange
    }
  }

  if (packageBump.devDeps !== null && isDependencyObject(packageJson.devDependencies)) {
    for (const [depName, depRange] of Object.entries(packageBump.devDeps)) {
      const fullDepName = `${options.autoNamePrefix}${depName}`

      packageJson.devDependencies[fullDepName] = depRange
    }
  }

  const packageData = JSON.stringify(packageJson, null, 2) + '\n'

  await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })

  await yarnInstall()
}
