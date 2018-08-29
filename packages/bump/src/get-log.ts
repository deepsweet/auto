import { compareReleaseTypes, TGitBump, TLog, TPackageBump } from '@auto/utils/src'
import { TGitOptions } from '@auto/git/src'

const getMessages = (gitBumps: TGitBump[], name: string) => {
  for (const bump of gitBumps) {
    if (bump.name === name) {
      return bump.messages
    }
  }

  return null
}

export const getLog = (packageBumps: TPackageBump[], gitBumps: TGitBump[], options: TGitOptions): TLog[] => {
  return packageBumps.reduce((res, bump) => {
    if (bump.version === null || bump.type === null) {
      return res
    }

    const messages = getMessages(gitBumps, bump.name)

    if (messages === null) {
      if (bump.deps !== null) {
        return res.concat({
          name: bump.name,
          version: bump.version,
          type: bump.type,
          messages: [{
            type: bump.type,
            prefix: options.prefixes[bump.type][0],
            value: `upgrade dependencies: ${Object.keys(bump.deps).join(', ')}`
          }]
        })
      }

      return res
    }

    if (bump.deps !== null) {
      return res.concat({
        name: bump.name,
        version: bump.version,
        type: bump.type,
        messages: messages
          .concat({
            type: bump.type,
            prefix: options.prefixes[bump.type][0],
            value: `upgrade dependencies: ${Object.keys(bump.deps).join(', ')}`
          })
          .sort((a, b) => compareReleaseTypes(b.type, a.type))
      })
    }

    return res.concat({
      name: bump.name,
      version: bump.version,
      type: bump.type,
      messages: messages
        .sort((a, b) => compareReleaseTypes(b.type, a.type))
    })
  }, [] as TLog[])
}
