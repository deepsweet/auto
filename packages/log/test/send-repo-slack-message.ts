import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { options } from '@auto/utils/test/options'
import { TSlackOptions } from '../src'

test('sendRepoSlackMessage', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-repo-slack-message', {
    'request-promise-native': {
      default: spy
    }
  })

  const { sendRepoSlackMessage } = await import('../src/send-repo-slack-message')

  await sendRepoSlackMessage(
    {
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
      token: 'token',
      username: 'username',
      channel: 'channel',
      iconEmoji: 'emoji',
      colors: {
        major: 'major',
        minor: 'minor',
        patch: 'patch'
      }
    },
    options
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{
        uri: 'https://hooks.slack.com/services/token',
        method: 'POST',
        json:
          {
            channel: 'channel',
            username: 'username',
            link_names: '1',
            icon_emoji: 'emoji',
            unfurl_media: false,
            attachments: [{
              color: 'minor',
              fields: [{ title: 'v0.1.2', value: '🌱 minor\n🌱 patch' }]
            }]
          }
      }]
    ],
    'should make request'
  )

  unmock('../src/send-repo-slack-message')
})

test('sendRepoSlackMessage: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/send-repo-slack-message', {
    'request-promise-native': {
      default: spy
    }
  })

  const { sendRepoSlackMessage } = await import('../src/send-repo-slack-message')

  try {
    await sendRepoSlackMessage(
      {
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
        username: 'username',
        channel: 'channel',
        iconEmoji: 'emoji',
        colors: {
          major: 'major',
          minor: 'minor',
          patch: 'patch'
        }
      } as TSlackOptions,
      options
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'Slack token is required')
  }

  unmock('../src/send-repo-slack-message')
})
