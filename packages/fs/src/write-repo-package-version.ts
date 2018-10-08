import path from 'path'
import { writeFile } from 'graceful-fs'
import { promisify } from 'util'
import { TRepoPackageBump } from '@auto/utils/src/'
import { getPackage } from './get-package'

const pWriteFile = promisify(writeFile)

export const writeRepoPackageVersion = async (packageBump: TRepoPackageBump) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = await getPackage(process.cwd())

  packageJson.version = packageBump.version

  const packageData = JSON.stringify(packageJson, null, 2) + '\n'

  await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
}
