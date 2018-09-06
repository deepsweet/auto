import { TOptions, TParsedMessageType, TParsedWorkspacesMessage } from '@auto/utils/src/'

export const parseWorkspacesCommitMessage = (message: string, options: TOptions): TParsedWorkspacesMessage | null => {
  const prefixes: [TParsedMessageType, string][] = [
    ['major', options.semverPrefixes.major.value],
    ['minor', options.semverPrefixes.minor.value],
    ['patch', options.semverPrefixes.patch.value],
    ['publish', options.autoPrefixes.publish.value]
  ]

  for (const [type, value] of prefixes) {
    const regexp = new RegExp(`^${value}\\s(.+?):\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    return {
      type,
      name: `${options.autoNamePrefix}${result[1]}`,
      message: result[2].trim()
    }
  }

  return null
}
