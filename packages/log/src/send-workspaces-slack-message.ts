import request from 'request-promise-native'
import { TOptions, TWorkspacesLog } from '@auto/utils/src'
import { TSlackOptions } from './types'
import { SLACK_HOOKS_URL } from './utils'

export const sendWorkspacesSlackMessage = async (logs: TWorkspacesLog[], slackOptions: TSlackOptions, autoOptions: TOptions) => {
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
      attachments: logs.map((bump) => ({
        color: slackOptions.colors[bump.type],
        fields: [
          {
            title: `${bump.name} v${bump.version}`,
            value: bump.messages
              .map((message) => `${autoOptions.requiredPrefixes[bump.type].value} ${message.value}`)
              .join('\n')
          }
        ]
      }))
    }
  })
}
