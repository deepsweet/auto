import path from 'path'
import { writeFile } from 'graceful-fs'
import { promisify } from 'util'
import { TWorkspacesPackageBump } from '@auto/utils/src/'
import { getPackage } from './get-package'

const pWriteFile = promisify(writeFile)

export const writeWorkspacesPackageVersion = async (packageBumps: TWorkspacesPackageBump[]) => {
  for (const bump of packageBumps) {
    if (bump.version === null) {
      continue
    }

    const packageJsonPath = path.join(bump.dir, 'package.json')
    const packageJson = await getPackage(bump.dir)

    packageJson.version = bump.version

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}
