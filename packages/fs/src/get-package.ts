import path from 'path'
import { TPackageJson } from '@auto/utils/src/'

export const getPackage = async (packageDir: string): Promise<TPackageJson> => {
  const packageJsonPath = path.join(packageDir, 'package.json')
  const { default: packageJson }: { default: TPackageJson } = await import(packageJsonPath)

  return packageJson
}
