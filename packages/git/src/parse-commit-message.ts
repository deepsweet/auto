import { TGitOptions, TCommitPrefixType } from './types'

const parseCommitMessage = (message: string, options: TGitOptions) => {
  for (const entry of Object.entries(options.prefixes)) {
    const [type, values] = entry as [TCommitPrefixType, string[]]
    const regexp = new RegExp(`^(${values.join('|')})\\s(.+?):\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    return {
      type,
      prefix: result[1],
      package: `@${options.namespace}/${result[2]}`,
      message: result[3].trim()
    }
  }

  return null
}

export default parseCommitMessage
