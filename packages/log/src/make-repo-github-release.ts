import { TOptions, TRepoLog } from '@auto/utils/src'
import { TGithubOptions } from './types'
import request from 'request-promise-native'
import { GITHUB_API_REPOS_URL } from './utils'

export const makeRepoGithubReleases = async (log: TRepoLog, githubOptions: TGithubOptions, autoOptions: TOptions) => {
  if (typeof githubOptions.token !== 'string') {
    throw new Error('GitHub token is required')
  }

  await request({
    uri: `${GITHUB_API_REPOS_URL}${githubOptions.username}/${githubOptions.repo}/releases`,
    method: 'POST',
    headers: {
      Authorization: `token ${githubOptions.token}`
    },
    json: {
      tag_name: `v${log.version}`,
      name: `v${log.version}`,
      body: log.messages
        .map((message) => `* ${autoOptions.requiredPrefixes[message.type].value} ${message.value}`)
        .join('\n')
    }
  })
}
