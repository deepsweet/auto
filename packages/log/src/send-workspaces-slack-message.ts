import request from 'request-promise-native'
import { TOptions, TWorkspacesLog } from '@auto/utils/src'
import { SLACK_HOOKS_URL } from './utils'

export const sendWorkspacesSlackMessage = async (logs: TWorkspacesLog[], token: string, options: TOptions) => {
  if (typeof token !== 'string') {
    throw new Error('Slack token is required')
  }

  if (typeof options.slack === 'undefined') {
    throw new Error('Slack options is required')
  }

  const slackOptions = options.slack

  await request({
    uri: `${SLACK_HOOKS_URL}${token}`,
    method: 'POST',
    json: {
      channel: slackOptions.channel,
      username: slackOptions.username,
      link_names: '1',
      icon_emoji: slackOptions.iconEmoji,
      unfurl_media: false,
      attachments: logs.map((bump) => ({
        color: slackOptions.colors[bump.type],
        fields: [
          {
            title: `${bump.name} v${bump.version}`,
            value: bump.messages
              .map((message) => `${options.requiredPrefixes[bump.type].value} ${message.value}`)
              .join('\n')
          }
        ]
      }))
    }
  })
}
