import { TOptions, TRepoLog } from '@auto/utils/src'
import request from 'request-promise-native'
import { GITHUB_API_REPOS_URL } from './utils'

export const makeRepoGithubRelease = async (log: TRepoLog, token: string, options: TOptions) => {
  if (typeof token !== 'string') {
    throw new Error('GitHub token is required')
  }

  if (typeof options.github === 'undefined') {
    throw new Error('GitHub options is required')
  }

  await request({
    uri: `${GITHUB_API_REPOS_URL}${options.github.username}/${options.github.repo}/releases`,
    method: 'POST',
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'auto-tools'
    },
    json: {
      tag_name: `v${log.version}`,
      name: `v${log.version}`,
      body: log.messages
        .map((message) => `* ${options.requiredPrefixes[message.type].value} ${message.value}`)
        .join('\n')
    }
  })
}
