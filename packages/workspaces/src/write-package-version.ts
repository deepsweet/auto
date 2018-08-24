import { writeFile } from 'fs'
import { promisify } from 'util'
import { TBumpStackItem, TPackageJson } from '@auto/utils/src/'

const pWriteFile = promisify(writeFile)

export const writePackageVersion = async (bumpStackItem: TBumpStackItem) => {
  if (bumpStackItem.version !== null) {
    const { default: packageJson }: { default: TPackageJson } = await import(bumpStackItem.path)

    packageJson.version = bumpStackItem.version

    const packageData = JSON.stringify(packageJson, null, 2) + '\n'

    await pWriteFile(bumpStackItem.path, packageData, { encoding: 'utf8' })
  }
}
