import { TCommitPrefixType, TOptions } from '@auto/utils/src'

export const parseRepoCommitMessage = (message: string, options: TOptions) => {
  for (const entry of Object.entries(options.prefixes)) {
    const [type, values] = entry as [TCommitPrefixType, string[]]
    const regexp = new RegExp(`^(${values.join('|')})\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    return {
      type,
      prefix: result[1],
      message: result[2].trim()
    }
  }

  return null
}
