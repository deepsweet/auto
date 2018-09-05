import { compareReleaseTypes, TGitWorkspacesBump, TOptions } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'
import { parseWorkspacesCommitMessage } from './parse-workspaces-commit-message'

type TGitBumps = {
  [key: string]: TGitWorkspacesBump
}

export const getWorkspacesBumps = async (options: TOptions): Promise<TGitWorkspacesBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []

  for (const message of messages) {
    const parsed = parseWorkspacesCommitMessage(message, options)

    if (parsed === null) {
      continue
    }

    if (completedPackages.includes(parsed.name)) {
      continue
    }

    if (parsed.type === 'publish') {
      completedPackages.push(parsed.name)
      continue
    }

    if (Reflect.has(bumps, parsed.name)) {
      const bump = bumps[parsed.name]

      bump.messages.push({
        type: parsed.type,
        value: parsed.message
      })

      if (compareReleaseTypes(parsed.type, bump.type) > 0) {
        bump.type = parsed.type
      }
    } else {
      bumps[parsed.name] = {
        name: parsed.name,
        type: parsed.type,
        messages: [{
          type: parsed.type,
          value: parsed.message
        }]
      }
    }
  }

  return Object.values(bumps)
}
