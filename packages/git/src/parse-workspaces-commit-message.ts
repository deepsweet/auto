import { TPrefixes } from '@auto/utils/src/'
import { makeRegExp } from './suggest-filter'
import { TParsedMessageType, TWorkspacesParsedMessage } from './types'

export const parseWorkspacesCommitMessage = (message: string, packageNames: string[], prefixes: TPrefixes): TWorkspacesParsedMessage | null => {
  const parsedPrefixes: [TParsedMessageType, string][] = [
    ['major', prefixes.required.major.value],
    ['minor', prefixes.required.minor.value],
    ['patch', prefixes.required.patch.value],
    ['publish', prefixes.required.publish.value],
    ['initial', prefixes.required.initial.value]
  ]

  for (const [type, value] of parsedPrefixes) {
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

        if (packageNames.includes(name)) {
          result.push(name)
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
