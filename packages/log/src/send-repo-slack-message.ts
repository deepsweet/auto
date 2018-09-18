import request from 'request-promise-native'
import { TOptions, TRepoLog } from '@auto/utils/src'
import { SLACK_HOOKS_URL } from './utils'

export const sendRepoSlackMessage = async (log: TRepoLog, token: string, options: TOptions) => {
  if (typeof token !== 'string') {
    throw new Error('Slack token is required')
  }

  if (typeof options.slack === 'undefined') {
    throw new Error('Slack options is required')
  }

  await request({
    uri: `${SLACK_HOOKS_URL}${token}`,
    method: 'POST',
    json: {
      channel: options.slack.channel,
      username: options.slack.username,
      link_names: '1',
      icon_emoji: options.slack.iconEmoji,
      unfurl_media: false,
      attachments: [{
        color: options.slack.colors[log.type],
        fields: [
          {
            title: `v${log.version}`,
            value: log.messages
              .map((message) => `${options.requiredPrefixes[log.type].value} ${message.value}`)
              .join('\n')
          }
        ]
      }]
    }
  })
}
