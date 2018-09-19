import { TOptions, TParsedMessageType, TWorkspacesParsedMessage } from '@auto/utils/src/'
import { makeRegExp } from './suggest-filter'

export const parseWorkspacesCommitMessage = (message: string, packageNames: string[], options: TOptions): TWorkspacesParsedMessage | null => {
  const prefixes: [TParsedMessageType, string][] = [
    ['major', options.requiredPrefixes.major.value],
    ['minor', options.requiredPrefixes.minor.value],
    ['patch', options.requiredPrefixes.patch.value],
    ['publish', options.requiredPrefixes.publish.value],
    ['initial', options.requiredPrefixes.initial.value]
  ]

  for (const [type, value] of prefixes) {
    const regexp = new RegExp(`^${value}\\s(.+?):\\s((?:[\r\n]|.)+)$`, 'm')
    const result = message.match(regexp)

    if (result === null) {
      continue
    }

    const namesStr = result[1].trim()
    const names = namesStr.split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .reduce((result, name) => {
        if (name.includes('*')) {
          const regExp = makeRegExp(name)
          const matchedNames = packageNames.filter((name) => regExp.test(name))

          for (const matchedName of matchedNames) {
            if (!result.includes(matchedName)) {
              result.push(matchedName)
            }
          }

          return result
        }

        const fullName = `${options.autoNamePrefix}${name}`

        if (packageNames.includes(fullName)) {
          result.push(fullName)
        }

        return result
      }, [] as string[])

    return {
      type,
      names,
      message: result[2].trim()
    }
  }

  return null
}
