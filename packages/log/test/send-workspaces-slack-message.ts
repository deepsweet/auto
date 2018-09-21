import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { TSlackOptions } from '../src/types'
import { prefixes } from '@auto/utils/test/prefixes'

const slackOptions: TSlackOptions = {
  token: 'token',
  username: 'username',
  channel: 'channel',
  iconEmoji: 'emoji',
  colors: {
    major: 'major',
    minor: 'minor',
    patch: 'patch'
  }
}

test('sendWorkspacesSlackMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-workspaces-slack-message', {
    'request-promise-native': {
      default: spy
    }
  })

  const { sendWorkspacesSlackMessage } = await import('../src/send-workspaces-slack-message')

  await sendWorkspacesSlackMessage(
    [
      {
        name: 'a',
        version: '0.1.2',
        type: 'minor',
        messages: [
          {
            type: 'minor',
            value: 'minor'
          },
          {
            type: 'patch',
            value: 'patch'
          }
        ]
      },
      {
        name: 'b',
        version: '1.2.3',
        type: 'minor',
        messages: [
          {
            type: 'minor',
            value: 'minor'
          },
          {
            type: 'patch',
            value: 'patch'
          }
        ]
      }
    ],
    prefixes,
    slackOptions
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{
        uri: 'https://hooks.slack.com/services/token',
        method: 'POST',
        json: {
          channel: 'channel',
          username: 'username',
          link_names: '1',
          icon_emoji: 'emoji',
          unfurl_media: false,
          attachments: [
            {
              color: 'minor',
              fields: [{ title: 'a v0.1.2', value: '🌱 minor\n🌱 patch' }]
            },
            {
              color: 'minor',
              fields: [{ title: 'b v1.2.3', value: '🌱 minor\n🌱 patch' }]
            }
          ]
        }
      }]
    ],
    'should make request'
  )

  unmock('../src/send-workspaces-slack-message')
})

test('sendWorkspacesSlackMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-workspaces-slack-message', {
    'request-promise-native': {
      default: spy
    }
  })

  const { sendWorkspacesSlackMessage } = await import('../src/send-workspaces-slack-message')

  try {
    await sendWorkspacesSlackMessage(
      [
        {
          name: 'a',
          version: '0.1.2',
          type: 'minor',
          messages: [
            {
              type: 'minor',
              value: 'minor'
            },
            {
              type: 'patch',
              value: 'patch'
            }
          ]
        },
        {
          name: 'b',
          version: '1.2.3',
          type: 'minor',
          messages: [
            {
              type: 'minor',
              value: 'minor'
            },
            {
              type: 'patch',
              value: 'patch'
            }
          ]
        }
      ],
      prefixes,
      // @ts-ignore
      { ...slackOptions, token: undefined }
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Slack token is required')
  }

  unmock('../src/send-workspaces-slack-message')
})
