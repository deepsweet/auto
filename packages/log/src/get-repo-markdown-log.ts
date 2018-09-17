import { TOptions, TRepoLog } from '@auto/utils/src'

export const getRepoMarkdownLog = (log: TRepoLog, options: TOptions): string => {
  let result = ''

  result += `## v${log.version}\n\n`

  log.messages.forEach((message) => {
    result += `* ${options.requiredPrefixes[message.type].value} ${message.value}\n`
  })

  return result
}
