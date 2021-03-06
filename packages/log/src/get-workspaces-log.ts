import { compareMessageTypes, TWorkspacesGitBump, TWorkspacesPackageBump } from '@auto/utils/src/'
import { TWorkspacesLog, TWorkspacesLogMessage } from './types'

const getMessages = (gitBumps: TWorkspacesGitBump[], name: string) => {
  for (const bump of gitBumps) {
    if (bump.name === name) {
      return bump.messages
    }
  }

  return []
}

export const getWorkspacesLog = (packageBumps: TWorkspacesPackageBump[], gitBumps: TWorkspacesGitBump[]): TWorkspacesLog[] => {
  return packageBumps.reduce((res, bump) => {
    if (bump.version === null || bump.type === null) {
      return res
    }

    let messages = getMessages(gitBumps, bump.name)

    if (bump.deps !== null) {
      return res.concat({
        name: bump.name,
        version: bump.version,
        type: bump.type,
        messages: [
          ...messages.sort((a, b) => compareMessageTypes(b.type, a.type)),
          {
            type: 'dependencies',
            value: `upgrade dependencies`
          } as TWorkspacesLogMessage
        ]
      })
    }

    if (messages.length === 0) {
      return res
    }

    return res.concat({
      name: bump.name,
      version: bump.version,
      type: bump.type,
      messages: messages.sort((a, b) => compareMessageTypes(b.type, a.type))
    })
  }, [] as TWorkspacesLog[])
}
