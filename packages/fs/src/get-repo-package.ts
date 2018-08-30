import path from 'path'
import { TPackageJson } from '@auto/utils/src'

export const getRepoPackage = (): Promise<TPackageJson> => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  return import(packageJsonPath)
}
