import { TOptions, TParsedMessageType, TParsedRepoMessage } from '@auto/utils/src/'

export const parseRepoCommitMessage = (message: string, options: TOptions): TParsedRepoMessage | null => {
  const prefixes: [TParsedMessageType, string][] = [
    ['major', options.semverPrefixes.major.value],
    ['minor', options.semverPrefixes.minor.value],
    ['patch', options.semverPrefixes.patch.value],
    ['publish', options.autoPrefixes.publish.value]
  ]

  for (const [type, value] of prefixes) {
    const regexp = new RegExp(`^${value}\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    return {
      type,
      message: result[1].trim()
    }
  }

  return null
}
