import { TOptions, TParsedMessageType, TRepoParsedMessage } from '@auto/utils/src/'

export const parseRepoCommitMessage = (message: string, options: TOptions): TRepoParsedMessage | null => {
  const prefixes: [TParsedMessageType, string][] = [
    ['major', options.requiredPrefixes.major.value],
    ['minor', options.requiredPrefixes.minor.value],
    ['patch', options.requiredPrefixes.patch.value],
    ['publish', options.requiredPrefixes.publish.value]
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
