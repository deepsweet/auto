/* eslint-disable no-throw-literal */
import plugin, { StartPlugin } from '@start/plugin'
import { TWorkspacesGitBump, TWorkspacesPackageBump, TPrefixes, TWorkspacesOptions } from '@auto/utils/src'
import { TGitOptions } from '@auto/git/src'
import { TBumpOptions } from '@auto/bump/src'
import { TNpmOptions } from '@auto/npm/src'
import { TSlackOptions, TGithubOptions, TWorkspacesLog } from '@auto/log/src'

export type TWorkspacesPluginData = {
  packagesBumps: TWorkspacesPackageBump[],
  gitBumps: TWorkspacesGitBump[]
}

export const makeWorkspacesCommit = (prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions) =>
  plugin('makeWorkspacesCommit', () => async () => {
    const { getWorkspacesPackages } = await import('@auto/fs/src')
    const { makeWorkspacesCommit } = await import('@auto/git/src')

    const packages = await getWorkspacesPackages(workspacesOptions)

    await makeWorkspacesCommit(packages, prefixes)
  })

export const getWorkspacesPackagesBumps = (prefixes: TPrefixes, gitOptions: TGitOptions, bumpOptions: TBumpOptions, workspacesOptions: TWorkspacesOptions) =>
  plugin<{}, TWorkspacesPluginData>('getWorkspacesPackagesBumps', () => async () => {
    const { getWorkspacesPackages } = await import('@auto/fs/src')
    const { getWorkspacesBumps } = await import('@auto/git/src')
    const { getWorkspacesPackagesBumps } = await import('@auto/bump/src')

    const packages = await getWorkspacesPackages(workspacesOptions)
    const gitBumps = await getWorkspacesBumps(packages, prefixes, gitOptions)

    if (gitBumps.length === 0) {
      throw new Error('No bumps')
    }

    const packagesBumps = await getWorkspacesPackagesBumps(packages, gitBumps, bumpOptions, workspacesOptions)

    return {
      packagesBumps,
      gitBumps
    }
  })

export const publishWorkspacesPrompt = (prefixes: TPrefixes) =>
  plugin<TWorkspacesPluginData, void>('publishWorkspacesPrompt', () => async ({ packagesBumps, gitBumps }) => {
    const { getWorkspacesLog } = await import('@auto/log/src')
    const { default: prompts } = await import('prompts')

    const logs = getWorkspacesLog(packagesBumps, gitBumps)

    logs.forEach((log) => {
      console.log('')

      console.log(`${log.name} → ${log.type} → v${log.version}\n`)

      log.messages.forEach((message) => {
        console.log(`${prefixes.required[message.type].value} ${message.value}`)
      })
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

export const buildBumpedPackages = (task: (...args: any[]) => StartPlugin<{}, void>) =>
  plugin<TWorkspacesPluginData, void>('buildBumpedPackages', ({ reporter }) => async ({ packagesBumps }) => {
    const path = await import('path')

    for (const bump of packagesBumps) {
      const packageDir = path.relative(path.resolve('packages/'), bump.dir)
      const taskRunner = await task(packageDir)

      await taskRunner(reporter)()
    }
  })

export const writeWorkspacesPackagesBumps = (prefixes: TPrefixes, workspacesOptions: TWorkspacesOptions) =>
  plugin<TWorkspacesPluginData, void>('writeWorkspacesPackagesBumps', ({ logMessage }) => async ({ packagesBumps }) => {
    const { writePackageDependencies, writeWorkspacesPackageVersion } = await import('@auto/fs/src')
    const {
      writeWorkspacesDependenciesCommit,
      writeWorkspacesPublishCommit
      // writeWorkspacesPublishTag
    } = await import('@auto/git/src')

    await writePackageDependencies(packagesBumps, workspacesOptions)
    logMessage('write package dependencies')

    await writeWorkspacesDependenciesCommit(packagesBumps, prefixes)
    logMessage('write dependencies commit')

    await writeWorkspacesPackageVersion(packagesBumps)
    logMessage('write packages versions')

    await writeWorkspacesPublishCommit(packagesBumps, prefixes)
    logMessage('write publish commit')

    // await writeWorkspacesPublishTag(bump)
    // logMessage('write publish tag')
  })

export const publishWorkspacesPackagesBumps = (npmOptions?: TNpmOptions) =>
  plugin<TWorkspacesPluginData, void>('publishWorkspacesPackagesBumps', () => async ({ packagesBumps }) => {
    const { publishWorkspacesPackage } = await import('@auto/npm/src')

    for (const bump of packagesBumps) {
      await publishWorkspacesPackage(bump, npmOptions)
    }
  })

export const sendWorkspacesSlackMessage = (prefixes: TPrefixes, slackOptions: TSlackOptions, transformFn?: (logs: TWorkspacesLog[]) => TWorkspacesLog[]) =>
  plugin<TWorkspacesPluginData, void>('sendWorkspacesSlackMessage', () => async ({ packagesBumps, gitBumps }) => {
    const { getWorkspacesLog, sendWorkspacesSlackMessage: send } = await import('@auto/log/src')

    let logs = getWorkspacesLog(packagesBumps, gitBumps)

    if (typeof transformFn === 'function') {
      logs = transformFn(logs)
    }

    await send(logs, prefixes, slackOptions)
  })

export const makeWorkspacesGithubReleases = (prefixes: TPrefixes, githubOptions: TGithubOptions) =>
  plugin<TWorkspacesPluginData, void>('makeWorkspacesGithubReleases', () => async ({ packagesBumps, gitBumps }) => {
    const { getWorkspacesLog, makeWorkspacesGithubReleases: make } = await import('@auto/log/src')

    const logs = getWorkspacesLog(packagesBumps, gitBumps)

    await make(logs, prefixes, githubOptions)
  })
