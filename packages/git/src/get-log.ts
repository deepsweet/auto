import parseCommitMessage from './parse-commit-message'
import { TGitOptions } from './types'
import { TChangelog } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'

type TGitLogs = {
  [key: string]: string[]
}

const getLog = async (options: TGitOptions): Promise<TChangelog[]> => {
  const messages = await getCommitMessages()
  const logs: TGitLogs = {}
  const completedPackages: string[] = []

  for (const message of messages) {
    const parsed = parseCommitMessage(message, options)

    if (parsed === null) {
      continue
    }

    if (completedPackages.includes(parsed.package)) {
      continue
    }

    if (parsed.type === 'publish') {
      completedPackages.push(parsed.package)
      continue
    }

    const prefixedMessage = `${parsed.prefix} ${parsed.message}`

    if (Reflect.has(logs, parsed.package)) {
      logs[parsed.package].push(prefixedMessage)
    } else {
      logs[parsed.package] = [prefixedMessage]
    }
  }

  return Object.entries(logs).reduce((res, [name, messages]) => {
    return res.concat({
      name,
      messages
    })
  }, [] as TChangelog[])
}

export default getLog
