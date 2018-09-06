import { compareReleaseTypes, TGitRepoBump, TOptions, TBumpType } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'
import { parseRepoCommitMessage } from './parse-repo-commit-message'

export const getRepoBump = async (options: TOptions): Promise<TGitRepoBump | null> => {
  const messages = await getCommitMessages()
  let bump: TGitRepoBump | null = null

  for (const message of messages) {
    const parsed = parseRepoCommitMessage(message, options)

    if (parsed === null) {
      continue
    }

    if (parsed.type === 'publish') {
      break
    }

    if (bump !== null) {
      bump.messages.push({
        type: parsed.type,
        value: parsed.message
      })

      if (compareReleaseTypes(parsed.type, bump.type) > 0) {
        bump.type = parsed.type
      }
    } else {
      bump = {
        type: parsed.type,
        messages: [{
          type: parsed.type,
          value: parsed.message
        }]
      }
    }
  }

  return bump
}