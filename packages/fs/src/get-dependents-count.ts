import { TWorkspacesPackageBump } from '@auto/utils/src'

export const getDependentsCount = (packageBump: TWorkspacesPackageBump) => {
  let depsCount = 0

  if (packageBump.deps !== null) {
    depsCount = Object.keys(packageBump.deps).length
  }

  let devDepsCount = 0

  if (packageBump.devDeps !== null) {
    devDepsCount = Object.keys(packageBump.devDeps).length
  }

  return depsCount + devDepsCount
}
