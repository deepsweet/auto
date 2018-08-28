import { compareReleaseTypes, TGitBump, TBumpType } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'
import { parseCommitMessage } from './parse-commit-message'
import { TGitOptions } from './types'

type TGitBumps = {
  [key: string]: TGitBump
}

export const getBumps = async (options: TGitOptions): Promise<TGitBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []

  for (const message of messages) {
    const parsed = parseCommitMessage(message, options)

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

    const prefixedMessage = `${parsed.prefix} ${parsed.message}`

    if (Reflect.has(bumps, parsed.package)) {
      const bump = bumps[parsed.package]

      bump.messages.push(prefixedMessage)

      if (compareReleaseTypes(parsed.type, bump.type) > 0) {
        bump.type = parsed.type
      }
    } else {
      bumps[parsed.package] = {
        name: parsed.package,
        type: parsed.type,
        messages: [prefixedMessage]
      }
    }
  }

  return Object.values(bumps)
}
