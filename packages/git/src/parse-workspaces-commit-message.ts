import { TOptions, TParsedMessageType, TWorkspacesParsedMessage } from '@auto/utils/src/'

export const parseWorkspacesCommitMessage = (message: string, options: TOptions): TWorkspacesParsedMessage | null => {
  const prefixes: [TParsedMessageType, string][] = [
    ['major', options.requiredPrefixes.major.value],
    ['minor', options.requiredPrefixes.minor.value],
    ['patch', options.requiredPrefixes.patch.value],
    ['publish', options.requiredPrefixes.publish.value]
  ]

  for (const [type, value] of prefixes) {
    const regexp = new RegExp(`^${value}\\s(.+?):\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    const name = result[1]

    return {
      type,
      name: name === '*' ? name : `${options.autoNamePrefix}${name}`,
      message: result[2].trim()
    }
  }

  return null
}
