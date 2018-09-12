import {
  compareReleaseTypes,
  removeAutoNamePrefix,
  TGitWorkspacesBump,
  TOptions,
  TWorkspacesLog,
  TWorkspacesPackageBump,
  TMessage
} from '@auto/utils/src/'

const getMessages = (gitBumps: TGitWorkspacesBump[], name: string) => {
  for (const bump of gitBumps) {
    if (bump.name === name) {
      return bump.messages
    }
  }

  return []
}

const sortMessages = (messages: TMessage[]): TMessage[] => {
  return messages.sort((a, b) => {
    if (b.type === 'dependencies') {
      return -1
    }

    if (a.type === 'dependencies') {
      return 1
    }

    return compareReleaseTypes(b.type, a.type)
  })
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
        messages: sortMessages(
          messages.concat({
            type: bump.type,
            value: `upgrade dependencies: ${bumpDepsNames}`
          })
        )
      })
    }

    if (messages.length === 0) {
      return res
    }

    return res.concat({
      name: bump.name,
      version: bump.version,
      type: bump.type,
      messages: sortMessages(messages)
    })
  }, [] as TWorkspacesLog[])
}
