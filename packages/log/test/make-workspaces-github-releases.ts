import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { options } from '@auto/utils/test/options'
import { TGithubOptions } from '../src'

test('makeWorkspacesGithubReleases', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/make-workspaces-github-releases', {
    'request-promise-native': {
      default: spy
    }
  })

  const { makeWorkspacesGithubReleases } = await import('../src/make-workspaces-github-releases')

  await makeWorkspacesGithubReleases(
    [
      {
        name: '@ns/a',
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
        name: '@ns/b',
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
    {
      token: 'token',
      username: 'username',
      repo: 'repo'
    },
    options
  )

  t.deepEquals(
    getSpyCalls(spy),
    [
      [{
        uri: 'https://api.github.com/repos/username/repo/releases',
        method: 'POST',
        headers: { Authorization: 'token token' },
        json: {
          tag_name: '@ns/a@0.1.2',
          name: '@ns/a@0.1.2',
          body: '* 🌱 minor\n* 🐞 patch'
        }
      }],
      [{
        uri: 'https://api.github.com/repos/username/repo/releases',
        method: 'POST',
        headers: { Authorization: 'token token' },
        json: {
          tag_name: '@ns/b@1.2.3',
          name: '@ns/b@1.2.3',
          body: '* 🌱 minor\n* 🐞 patch'
        }
      }]
    ],
    'should make request'
  )

  unmock('../src/make-workspaces-github-releases')
})

test('makeWorkspacesGithubReleases: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/make-workspaces-github-releases', {
    'request-promise-native': {
      default: spy
    }
  })

  const { makeWorkspacesGithubReleases } = await import('../src/make-workspaces-github-releases')

  try {
    await makeWorkspacesGithubReleases(
      [
        {
          name: '@ns/a',
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
          name: '@ns/b',
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
      {
        username: 'username',
        repo: 'repo'
      } as TGithubOptions,
      options
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'GitHub token is required')
  }

  unmock('../src/make-workspaces-github-releases')
})
