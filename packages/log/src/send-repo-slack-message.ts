import request from 'request-promise-native'
import { TOptions, TRepoLog } from '@auto/utils/src'
import { TSlackOptions } from './types'
import { SLACK_HOOKS_URL } from './utils'

export const sendRepoSlackMessage = async (log: TRepoLog, slackOptions: TSlackOptions, autoOptions: TOptions) => {
  if (typeof slackOptions.token !== 'string') {
    throw new Error('Slack token is required')
  }

  await request({
    uri: `${SLACK_HOOKS_URL}${slackOptions.token}`,
    method: 'POST',
    json: {
      channel: slackOptions.channel,
      username: slackOptions.username,
      link_names: '1',
      icon_emoji: slackOptions.iconEmoji,
      unfurl_media: false,
      attachments: [{
        color: slackOptions.colors[log.type],
        fields: [
          {
            title: `v${log.version}`,
            value: log.messages
              .map((message) => `${autoOptions.requiredPrefixes[log.type].value} ${message.value}`)
              .join('\n')
          }
        ]
      }]
    }
  })
}
