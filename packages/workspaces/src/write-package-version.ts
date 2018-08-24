import { writeFile } from 'fs'
import { promisify } from 'util'
import { TPackageBump, TPackageJson } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writePackageVersion = async (packageBump: TPackageBump) => {
  if (packageBump.version !== null) {
    const { default: packageJson }: { default: TPackageJson } = await import(packageBump.path)

    packageJson.version = packageBump.version

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(packageBump.path, packageData, { encoding: 'utf8' })
  }
}
