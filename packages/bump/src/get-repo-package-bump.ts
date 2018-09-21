import { TRepoGitBump, TPackageJson, TRepoPackageBump } from '@auto/utils/src/'
import { bumpVersion } from './bump-version'
import { TBumpOptions } from './types'

export const getRepoPackageBump = (packageJson: TPackageJson, bump: TRepoGitBump, options: TBumpOptions): TRepoPackageBump => {
  return {
    type: bump.type,
    version: bumpVersion(packageJson.version, bump.type, options)
  }
}
