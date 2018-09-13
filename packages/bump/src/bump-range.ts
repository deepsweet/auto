import semver from 'semver'
import { TBumpType } from '@auto/utils/src/'
import { bumpVersion } from '@auto/bump/src/bump-version'

export const bumpRange = (range: string, version: string, type: TBumpType): string => {
  if (/[<>=|]/.test(range)) {
    throw new Error(`range '${range}' is not supported`)
  }

  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  const matches = range.match(/^([\^~])?.+$/)

  if (matches === null) {
    throw new Error(`range ${range} is not supported`)
  }

  const symb = matches[1]
  const newVersion = bumpVersion(version, type)

  if (typeof symb === 'undefined') {
    return newVersion
  }

  if (semver.satisfies(newVersion, range)) {
    return `${symb}${newVersion}`
  }

  return `^${newVersion}`
}
