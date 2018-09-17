import { TOptions, TWorkspacesLog } from '@auto/utils/src'

export const getWorkspacesMarkdownLog = (logs: TWorkspacesLog[], options: TOptions): string => {
  let result = ''

  logs.forEach((log, index) => {
    if (index > 0) {
      result += '\n'
    }

    result += `## ${log.name} v${log.version}\n\n`

    log.messages.forEach((message) => {
      result += `* ${options.requiredPrefixes[message.type].value} ${message.value}\n`
    })
  })

  return result
}
