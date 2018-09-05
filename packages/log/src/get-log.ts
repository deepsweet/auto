import {
  compareReleaseTypes,
  TGitWorkspacesBump,
  TOptions,
  TWorkspacesLog,
  TWorkspacesPackageBump
} from '@auto/utils/src/'

const getMessages = (gitBumps: TGitWorkspacesBump[], name: string) => {
  for (const bump of gitBumps) {
    if (bump.name === name) {
      return bump.messages
    }
  }

  return null
}

export const getLog = (packageBumps: TWorkspacesPackageBump[], gitBumps: TGitWorkspacesBump[], options: TOptions): TWorkspacesLog[] => {
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
  }, [] as TWorkspacesLog[])
}
