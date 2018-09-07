import {
  compareReleaseTypes,
  removeAutoNamePrefix,
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

  return []
}

export const getLog = (packageBumps: TWorkspacesPackageBump[], gitBumps: TGitWorkspacesBump[], options: TOptions): TWorkspacesLog[] => {
  return packageBumps.reduce((res, bump) => {
    if (bump.version === null || bump.type === null) {
      return res
    }

    let messages = getMessages(gitBumps, bump.name)

    if (bump.deps !== null) {
      const bumpDepsNames = Object.keys(bump.deps)
        .map((name) => removeAutoNamePrefix(name, options.autoNamePrefix))
        .join(', ')

      return res.concat({
        name: bump.name,
        version: bump.version,
        type: bump.type,
        messages: messages
          .concat({
            type: bump.type,
            value: `upgrade dependencies: ${bumpDepsNames}`
          })
          .sort((a, b) => compareReleaseTypes(b.type, a.type))
      })
    }

    if (messages.length === 0) {
      return res
    }

    return res.concat({
      name: bump.name,
      version: bump.version,
      type: bump.type,
      messages: messages.sort((a, b) => compareReleaseTypes(b.type, a.type))
    })
  }, [] as TWorkspacesLog[])
}
