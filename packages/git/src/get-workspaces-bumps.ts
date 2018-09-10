import { compareReleaseTypes, TGitWorkspacesBump, TOptions, TPackages } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'
import { parseWorkspacesCommitMessage } from './parse-workspaces-commit-message'
import { makeRegExp } from './suggest-filter'

type TGitBumps = {
  [key: string]: TGitWorkspacesBump
}

export const getWorkspacesBumps = async (packages: TPackages, options: TOptions): Promise<TGitWorkspacesBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []
  const packageNames = Object.keys(packages)

  for (const message of messages) {
    const parsed = parseWorkspacesCommitMessage(message, options)

    if (parsed === null) {
      continue
    }

    let parsedNames = null

    if (parsed.name.includes('*')) {
      const regExp = makeRegExp(parsed.name)

      parsedNames = packageNames.filter((name) => regExp.test(name))
    } else {
      parsedNames = [parsed.name]
    }

    for (const name of parsedNames) {
      if (!packageNames.includes(name)) {
        continue
      }

      if (completedPackages.includes(name)) {
        continue
      }

      if (parsed.type === 'publish') {
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
