import semver from 'semver'
import { TBumpType, TOptions } from '@auto/utils/src/'

export const bumpVersion = (version: string, type: TBumpType, options: TOptions): string => {
  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  if (coercedVersion.major === 0) {
    if (coercedVersion.minor === 0 && options.zeroBreakingChangeType === 'patch') {
      return coercedVersion.inc('patch').version
    }

    if (options.zeroBreakingChangeType === 'minor' && type !== 'patch') {
      return coercedVersion.inc('minor').version
    }
  }

  return coercedVersion.inc(type).version
}
