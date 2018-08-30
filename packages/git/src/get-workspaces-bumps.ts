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

    if (completedPackages.includes(parsed.package)) {
      continue
    }

    if (parsed.type === 'dependencies') {
      continue
    }

    if (parsed.type === 'publish') {
      completedPackages.push(parsed.package)
      continue
    }

    if (Reflect.has(bumps, parsed.package)) {
      const bump = bumps[parsed.package]

      bump.messages.push({
        type: parsed.type,
        prefix: parsed.prefix,
        value: parsed.message
      })

      if (compareReleaseTypes(parsed.type, bump.type) > 0) {
        bump.type = parsed.type
      }
    } else {
      bumps[parsed.package] = {
        name: parsed.package,
        type: parsed.type,
        messages: [{
          type: parsed.type,
          prefix: parsed.prefix,
          value: parsed.message
        }]
      }
    }
  }

  return Object.values(bumps)
}
