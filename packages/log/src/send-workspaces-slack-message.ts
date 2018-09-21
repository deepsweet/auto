import request from 'request-promise-native'
import { TPrefixes } from '@auto/utils/src'
import { SLACK_HOOKS_URL } from './utils'
import { TSlackOptions, TWorkspacesLog } from './types'

export const sendWorkspacesSlackMessage = async (logs: TWorkspacesLog[], prefixes: TPrefixes, options: TSlackOptions) => {
  if (typeof options.token !== 'string') {
    throw new Error('Slack token is required')
  }

  await request({
    uri: `${SLACK_HOOKS_URL}${options.token}`,
    method: 'POST',
    json: {
      channel: options.channel,
      username: options.username,
      link_names: '1',
      icon_emoji: options.iconEmoji,
      unfurl_media: false,
      attachments: logs.map((bump) => ({
        color: options.colors[bump.type],
        fields: [
          {
            title: `${bump.name} v${bump.version}`,
            value: bump.messages
              .map((message) => `${prefixes.required[message.type].value} ${message.value}`)
              .join('\n')
          }
        ]
      }))
    }
  })
}
