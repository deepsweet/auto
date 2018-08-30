import path from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { TPackageJson, TRepoPackageBump } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writeRepoPackageVersion = async (packageBump: TRepoPackageBump) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const { default: packageJson }: { default: TPackageJson } = await import(packageJsonPath)

  packageJson.version = packageBump.version

  const packageData = JSON.stringify(packageJson, null, 2) + '\n'

  await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
}
