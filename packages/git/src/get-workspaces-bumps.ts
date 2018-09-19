import { compareReleaseTypes, TWorkspacesGitBump, TOptions, TPackages } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'
import { parseWorkspacesCommitMessage } from './parse-workspaces-commit-message'

type TGitBumps = {
  [key: string]: TWorkspacesGitBump
}

export const getWorkspacesBumps = async (packages: TPackages, options: TOptions): Promise<TWorkspacesGitBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []
  const packageNames = Object.keys(packages)

  for (const message of messages) {
    const parsed = parseWorkspacesCommitMessage(message, packageNames, options)

    if (parsed === null) {
      continue
    }

    for (const name of parsed.names) {
      if (completedPackages.includes(name)) {
        continue
      }

      if (parsed.type === 'publish') {
        completedPackages.push(name)
        continue
      }

      if (parsed.type === 'initial') {
        if (Reflect.has(bumps, name)) {
          const bump = bumps[name]

          bump.messages.push({
            type: parsed.type,
            value: parsed.message
          })

          bump.type = options.initialType
        } else {
          bumps[name] = {
            name,
            type: options.initialType,
            messages: [{
              type: parsed.type,
              value: parsed.message
            }]
          }
        }

        completedPackages.push(name)
        continue
      }

      if (Reflect.has(bumps, name)) {
        const bump = bumps[name]

        bump.messages.push({
          type: parsed.type,
          value: parsed.message
        })

        if (compareReleaseTypes(parsed.type, bump.type) > 0) {
          bump.type = parsed.type
        }
      } else {
        bumps[name] = {
          name,
          type: parsed.type,
          messages: [{
            type: parsed.type,
            value: parsed.message
          }]
        }
      }
    }

    if (packageNames.length === completedPackages.length) {
      break
    }
  }

  return Object.values(bumps)
}
