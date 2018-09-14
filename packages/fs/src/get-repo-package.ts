import { TPackageJson } from '@auto/utils/src/'
import { getPackage } from './get-package'

export const getRepoPackage = (): Promise<TPackageJson> => {
  return getPackage(process.cwd())
}
