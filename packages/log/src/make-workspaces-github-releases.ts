import { TOptions, TWorkspacesLog } from '@auto/utils/src'
import request from 'request-promise-native'
import { GITHUB_API_REPOS_URL } from './utils'

export const makeWorkspacesGithubReleases = async (logs: TWorkspacesLog[], token: string, options: TOptions) => {
  if (typeof token !== 'string') {
    throw new Error('GitHub token is required')
  }

  if (typeof options.github === 'undefined') {
    throw new Error('GitHub options is required')
  }

  for (const log of logs) {
    await request({
      uri: `${GITHUB_API_REPOS_URL}${options.github.username}/${options.github.repo}/releases`,
      method: 'POST',
      headers: {
        Authorization: `token ${token}`,
        'User-Agent': 'auto-tools'
      },
      json: {
        tag_name: `${log.name}@${log.version}`,
        name: `${log.name}@${log.version}`,
        body: log.messages
          .map((message) => `* ${options.requiredPrefixes[message.type].value} ${message.value}`)
          .join('\n')
      }
    })
  }
}
