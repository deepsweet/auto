import path from 'path'
import { writeFile } from 'fs'
import { promisify } from 'util'
import { TWorkspacesPackageBump, TPackageJson } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writeWorkspacesPackageVersion = async (packageBump: TWorkspacesPackageBump) => {
  if (packageBump.version !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')

    const { default: packageJson }: { default: TPackageJson } = await import(packageJsonPath)

    packageJson.version = packageBump.version

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(packageJsonPath, packageData, { encoding: 'utf8' })
  }
}
