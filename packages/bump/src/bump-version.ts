import semver from 'semver'
import { TBumpType, TOptions } from '@auto/utils/src/'

export const bumpVersion = (version: string, type: TBumpType, options: TOptions) => {
  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  if (options.zeroMajorBump === 'minor' && coercedVersion.major === 0 && type === 'major') {
    return coercedVersion.inc('minor').version
  }

  return coercedVersion.inc(type).version
}
