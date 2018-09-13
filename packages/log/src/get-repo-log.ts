import { compareReleaseTypes, TRepoGitBump, TRepoLog, TRepoPackageBump } from '@auto/utils/src/'

export const getRepoLog = (packageBump: TRepoPackageBump, gitBump: TRepoGitBump): TRepoLog => ({
  version: packageBump.version,
  type: packageBump.type,
  messages: gitBump.messages.sort((a, b) => compareReleaseTypes(b.type, a.type))
})
