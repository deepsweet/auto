import path from 'path'
import { writeFile } from 'graceful-fs'
import { promisify } from 'util'
import { TWorkspacesPackageBump } from '@auto/utils/src/'
import { getPackage } from './get-package'

const pWriteFile = promisify(writeFile)

export const writeWorkspacesPackageVersion = async (packageBump: TWorkspacesPackageBump) => {
  if (packageBump.version !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')
    const packageJson = await getPackage(packageBump.dir)

    packageJson.version = packageBump.version

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}
