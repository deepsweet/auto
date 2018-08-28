import { getDependentsCount, getDependentsOf, TPackages } from '@auto/workspaces/src/'
import { compareReleaseTypes, TGitBump, TPackageBump, TBumpType } from '@auto/utils/src/'
import { bumpRange } from './bump-range'
import { bumpVersion } from './bump-version'

export const getPackagesBumps = (packages: TPackages, bumps: TGitBump[]): TPackageBump[] => {
  for (const bump of bumps) {
    if (!Reflect.has(packages, bump.name)) {
      throw new Error(`Unable to find package ${bump.name} in packages`)
    }
  }

  const bumpStack: { [name: string]: TPackageBump } = {}

  const getStackDepsRange = (name: string, depName: string): string | null => {
    if (!Reflect.has(bumpStack, name)) {
      return null
    }

    const stackItem = bumpStack[name]

    return stackItem.deps !== null ? stackItem.deps[depName] : null
  }

  const bumpDependents = (name: string, version: string, type: TBumpType): void => {
    const dependents = getDependentsOf(packages, name)

    if (dependents === null) {
      return
    }

    for (const dependent of dependents) {
      const dependentPackage = packages[dependent.name]
      let bumpedRange = null
      let bumpedDevRange = null
      let bumpedVersion = null

      if (dependent.range !== null) {
        const tempRange = bumpRange(dependent.range, version, type)
        const stackRange = getStackDepsRange(dependent.name, name)

        // if bumped range is different from the range from stack (existing or not) then bump
        if (tempRange !== stackRange) {
          bumpedRange = tempRange
        }
      }

      if (dependent.devRange !== null) {
        bumpedDevRange = bumpRange(dependent.devRange, version, type)
      }

      // if no ranges were bumped then there is no need to proceed
      if (bumpedRange === null && bumpedDevRange === null) {
        continue
      }

      // if range was bumped then dependent version should be bumped as well
      if (bumpedRange !== null) {
        bumpedVersion = bumpVersion(dependentPackage.json.version, type)
      }

      if (Reflect.has(bumpStack, dependent.name)) {
        const bumpStackItem = bumpStack[dependent.name]

        if (bumpedVersion !== null) {
          bumpStackItem.version = bumpedVersion
          bumpStackItem.type = type
        }

        if (bumpedRange !== null) {
          bumpStackItem.deps = {
            ...bumpStackItem.deps,
            [name]: bumpedRange
          }
        }

        if (bumpedDevRange !== null) {
          bumpStackItem.devDeps = {
            ...bumpStackItem.devDeps,
            [name]: bumpedDevRange
          }
        }
      } else {
        bumpStack[dependent.name] = {
          name: dependent.name,
          dir: dependentPackage.dir,
          version: null,
          type: null,
          messages: null,
          deps: null,
          devDeps: null
        }

        if (bumpedVersion !== null) {
          bumpStack[dependent.name].version = bumpedVersion
          bumpStack[dependent.name].type = type
        }

        if (bumpedRange !== null) {
          bumpStack[dependent.name].deps = {
            ...bumpStack[dependent.name].deps,
            [name]: bumpedRange
          }
        }

        if (bumpedDevRange !== null) {
          bumpStack[dependent.name].devDeps = {
            ...bumpStack[dependent.name].devDeps,
            [name]: bumpedDevRange
          }
        }
      }

      if (bumpedVersion !== null) {
        bumpDependents(dependent.name, dependentPackage.json.version, type)
      }
    }
  }

  for (const bump of bumps) {
    const packageItem = packages[bump.name]

    if (Reflect.has(bumpStack, bump.name)) {
      const bumpStackItem = bumpStack[bump.name]

      // if there was already a bump greater or equal than the current
      // then do nothing
      if (compareReleaseTypes(bumpStackItem.type, bump.type) >= 0) {
        continue
      }

      bumpStack[bump.name] = {
        ...bumpStackItem,
        version: bumpVersion(packageItem.json.version, bump.type),
        type: bump.type,
        messages: bump.messages
      }
    } else {
      bumpStack[bump.name] = {
        name: bump.name,
        dir: packageItem.dir,
        version: bumpVersion(packageItem.json.version, bump.type),
        type: bump.type,
        messages: bump.messages,
        deps: null,
        devDeps: null
      }
    }

    bumpDependents(bump.name, packageItem.json.version, bump.type)
  }

  return Object.values(bumpStack)
    .sort((a, b) => getDependentsCount(a) - getDependentsCount(b))
}
