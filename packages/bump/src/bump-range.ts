import semver from 'semver'
import { TBumpType } from '@auto/utils/src/'

const bumpRange = (range: string, version: string, type: TBumpType): string => {
  if (/[<>=|]/.test(range)) {
    throw new Error(`range '${range}' is not supported`)
  }

  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  const matches = range.match(/^([\^~])?(.+)$/)

  if (matches === null) {
    throw new Error(`range ${range} is not supported`)
  }

  const [symb, rangeVersion] = matches.slice(1)
  const coercedRangeVersion = semver.coerce(rangeVersion)

  if (coercedRangeVersion === null) {
    throw new Error(`invalid range ${range}`)
  }

  const newVersion = coercedVersion.inc(type).version

  if (typeof symb === 'undefined') {
    return newVersion
  }

  if (semver.satisfies(newVersion, range)) {
    return `${symb}${newVersion}`
  }

  return `^${newVersion}`
}

export default bumpRange
