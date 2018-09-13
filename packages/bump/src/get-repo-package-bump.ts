import { TGitRepoBump, TOptions, TPackageJson, TRepoPackageBump } from '@auto/utils/src/'
import { bumpVersion } from './bump-version'

export const getRepoPackageBump = (packageJson: TPackageJson, bump: TGitRepoBump, options: TOptions): TRepoPackageBump => {
  return {
    type: bump.type,
    version: bumpVersion(packageJson.version, bump.type, options)
  }
}
