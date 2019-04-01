/* eslint-disable no-throw-literal */
import plugin from '@start/plugin'
import { TRepoGitBump, TRepoPackageBump, TPrefixes } from '@auto/utils/src'
import { TGitOptions } from '@auto/git/src'
import { TBumpOptions } from '@auto/bump/src'
import { TNpmOptions } from '@auto/npm/src'
import { TSlackOptions, TGithubOptions, TRepoLog } from '@auto/log/src'

export type TRepoPluginData = {
  packageBump: TRepoPackageBump,
  gitBump: TRepoGitBump
}

export const makeRepoCommit = (prefixes: TPrefixes) =>
  plugin('makeRepoCommit', () => async () => {
    const { makeRepoCommit } = await import('@auto/git/src')

    await makeRepoCommit(prefixes)
  })

export const getRepoPackageBumps = (prefixes: TPrefixes, gitOptions: TGitOptions, bumpOptions: TBumpOptions) =>
  plugin<{}, TRepoPluginData>('getRepoPackageBumps', () => async () => {
    const { getRepoPackage } = await import('@auto/fs/src')
    const { getRepoBump } = await import('@auto/git/src')
    const { getRepoPackageBump } = await import('@auto/bump/src')

    const pkg = await getRepoPackage()
    const gitBump = await getRepoBump(prefixes, gitOptions)

    if (gitBump === null) {
      throw new Error('No bumps')
    }

    const packageBump = await getRepoPackageBump(pkg, gitBump, bumpOptions)

    return {
      packageBump,
      gitBump
    }
  })

export const publishRepoPrompt = (prefixes: TPrefixes) =>
  plugin<TRepoPluginData, any>('publishRepoPrompt', () => async ({ packageBump, gitBump }) => {
    const { getRepoLog } = await import('@auto/log/src')
    const { default: prompts } = await import('prompts')

    const log = getRepoLog(packageBump, gitBump)

    console.log('')

    console.log(`${log.type} → v${log.version}\n`)

    log.messages.forEach((message) => {
      console.log(`${prefixes.required[message.type].value} ${message.value}`)
    })

    console.log('')

    const { isOk } = await prompts({
      type: 'toggle',
      name: 'isOk',
      message: 'Looks good?',
      initial: false,
      active: 'yes',
      inactive: 'no'
    })

    if (typeof isOk === 'undefined' || isOk === false) {
      throw null
    }
  })

export const writeRepoPackageBump = (prefixes: TPrefixes) =>
  plugin<TRepoPluginData, any>('writeRepoPackageBump', ({ logMessage }) => async ({ packageBump }) => {
    const { writeRepoPackageVersion } = await import('@auto/fs/src')
    const {
      writeRepoPublishCommit,
      writeRepoPublishTag
    } = await import('@auto/git/src')

    await writeRepoPackageVersion(packageBump)
    logMessage('write package version')

    await writeRepoPublishCommit(packageBump, prefixes)
    logMessage('write publish commit')

    logMessage('write publish tag')
    await writeRepoPublishTag(packageBump)
  })

export const publishRepoPackageBump = (npmOptions?: TNpmOptions) =>
  plugin('publishRepoPackageBump', () => async () => {
    const { publishRepoPackage } = await import('@auto/npm/src')

    await publishRepoPackage(npmOptions)
  })

export const sendRepoSlackMessage = (prefixes: TPrefixes, slackOptions: TSlackOptions, transformFn?: (log: TRepoLog) => TRepoLog) =>
  plugin<TRepoPluginData, any>('sendRepoSlackMessage', () => async ({ packageBump, gitBump }) => {
    const { getRepoLog, sendRepoSlackMessage: send } = await import('@auto/log/src')
    let log = getRepoLog(packageBump, gitBump)

    if (typeof transformFn === 'function') {
      log = transformFn(log)
    }

    await send(log, prefixes, slackOptions)
  })

export const makeRepoGithubRelease = (prefixes: TPrefixes, githubOptions: TGithubOptions) =>
  plugin<TRepoPluginData, any>('makeRepoGithubRelease', () => async ({ packageBump, gitBump }) => {
    const { getRepoLog, makeRepoGithubRelease: make } = await import('@auto/log/src')

    const log = getRepoLog(packageBump, gitBump)

    await make(log, prefixes, githubOptions)
  })
