import semver from 'semver'
import { TBumpType } from '@auto/utils/src/'

const bumpVersion = (version: string, type: TBumpType) => {
  const coercedVersion = semver.coerce(version)

  if (coercedVersion === null) {
    throw new Error(`invalid version ${version}`)
  }

  return coercedVersion.inc(type).version
}

export default bumpVersion
