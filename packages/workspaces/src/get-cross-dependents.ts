import { isDependencyObject, TPackageJson } from '@auto/utils/src/'
import { TCrossDependents, TPackages } from './types'

const isDependent = (pkg: TPackageJson, dependsOnName: string): boolean => {
  let isDep = false

  if (isDependencyObject(pkg.dependencies)) {
    isDep = Reflect.has(pkg.dependencies, dependsOnName) || isDep
  }

  if (isDependencyObject(pkg.devDependencies)) {
    isDep = Reflect.has(pkg.devDependencies, dependsOnName) || isDep
  }

  return isDep
}

const getDependencyRange = ({ dependencies }: TPackageJson, name: string) =>
  isDependencyObject(dependencies) && Reflect.has(dependencies, name)
    ? dependencies[name]
    : null

const getDevDependencyRange = ({ devDependencies }: TPackageJson, name: string) =>
  isDependencyObject(devDependencies) && Reflect.has(devDependencies, name)
    ? devDependencies[name]
    : null

export const getCrossDependents = (packages: TPackages): TCrossDependents =>
  Object.keys(packages).reduce(
    (pkgs, name) => {
      const dependentNames = Object.keys(packages)
        .filter((depName) => isDependent(packages[depName].json, name))

      if (dependentNames.length > 0) {
        pkgs[name] = dependentNames.map((depName) => ({
          name: depName,
          range: getDependencyRange(packages[depName].json, name),
          devRange: getDevDependencyRange(packages[depName].json, name)
        }))
      }

      return pkgs
    },
    {} as TCrossDependents
  )
