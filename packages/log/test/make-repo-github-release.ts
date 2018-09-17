import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { options } from '@auto/utils/test/options'
import { TGithubOptions } from '../src'

test('makeRepoGithubReleases', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/make-repo-github-release', {
    'request-promise-native': {
      default: spy
    }
  })

  const { makeRepoGithubReleases } = await import('../src/make-repo-github-release')

  await makeRepoGithubReleases(
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
          tag_name: 'v0.1.2',
          name: 'v0.1.2',
          body: '* 🌱 minor\n* 🐞 patch'
        }
      }]
    ],
    'should make request'
  )

  unmock('../src/make-repo-github-release')
})

test('makeRepoGithubReleases: throws if there is no token', async (t) => {
  const spy = createSpy(() => Promise.resolve())

  mock('../src/make-repo-github-release', {
    'request-promise-native': {
      default: spy
    }
  })

  const { makeRepoGithubReleases } = await import('../src/make-repo-github-release')

  try {
    await makeRepoGithubReleases(
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
        repo: 'repo'
      } as TGithubOptions,
      options
    )

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, 'GitHub token is required')
  }

  unmock('../src/make-repo-github-release')
})
