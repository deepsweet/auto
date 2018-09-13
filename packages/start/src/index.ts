/* eslint-disable no-throw-literal */
import plugin, { StartPlugin } from '@start/plugin'
import { TOptions } from '@auto/utils/src/'

export const makeCommit = (options: TOptions) =>
  plugin('makeCommit', async () => {
    const { getWorkspacesPackages } = await import('@auto/fs/src/')
    const { makeWorkspacesCommit } = await import('@auto/git/src/')

    const packages = await getWorkspacesPackages()

    await makeWorkspacesCommit(packages, options)
  })

export const getPackagesBumps = (options: TOptions) =>
  plugin('getPackagesBumps', async () => {
    const { getWorkspacesPackages } = await import('@auto/fs/src/')
    const { getWorkspacesBumps } = await import('@auto/git/src/')
    const { getWorkspacesPackagesBumps } = await import('@auto/bump/src/')

    const packages = await getWorkspacesPackages()
    const gitBumps = await getWorkspacesBumps(packages, options)
    const packagesBumps = await getWorkspacesPackagesBumps(packages, gitBumps)

    return {
      packagesBumps,
      gitBumps
    }
  })

export const publishPrompt = (options: TOptions) =>
  plugin('prompt', async ({ packagesBumps, gitBumps }) => {
    const { getLog } = await import('@auto/log/src/')
    const { default: prompts } = await import('prompts')

    const logs = getLog(packagesBumps, gitBumps, options)

    logs.forEach((log) => {
      console.log('')

      console.log(`${log.name} → ${log.type} → v${log.version}\n`)

      log.messages.forEach((message) => {
        console.log(`${options.requiredPrefixes[message.type].value} ${message.value}`)
      })
    })

    console.log('')

    const { isOk } = await prompts({
      type: 'toggle',
      name: 'isOk',
      message: 'Looks good?',
      initial: true,
      active: 'yes',
      inactive: 'no'
    })

    if (typeof isOk === 'undefined' || isOk === false) {
      throw null
    }
  })

export const buildBumpedPackages = (task: (...args: any[]) => StartPlugin) =>
  plugin('buildBumpedPackages', async ({ packagesBumps, reporter }) => {
    const path = await import('path')

    for (const bump of packagesBumps) {
      const packageDir = path.relative(path.resolve('packages/'), bump.dir)
      const taskRunner = await task(packageDir)

      await taskRunner({ reporter })
    }
  })

export const writePackagesBumps = (options: TOptions) =>
  plugin('writePackagesBumps', async ({ packagesBumps, logMessage }) => {
    const { writePackageDependencies, writeWorkspacesPackageVersion } = await import('@auto/fs/src/')
    const {
      writeWorkspacesDependenciesCommit,
      writeWorkspacesPublishCommit,
      writeWorkspacesPublishTag
    } = await import('@auto/git/src/')

    for (const bump of packagesBumps) {
      logMessage(bump.name)

      await writePackageDependencies(bump)
      logMessage('write package dependencies')

      await writeWorkspacesDependenciesCommit(bump, options)
      logMessage('write dependencies commit')

      await writeWorkspacesPackageVersion(bump)
      logMessage('write package version')

      await writeWorkspacesPublishCommit(bump, options)
      logMessage('write publish commit')

      logMessage('write publish tag')
      await writeWorkspacesPublishTag(bump, options)
    }
  })

export const publishPackagesBumps = plugin('publishPackagesBumps', async ({ packagesBumps }) => {
  const { publishWorkspacesPackage } = await import('@auto/npm/src/')

  for (const bump of packagesBumps) {
    await publishWorkspacesPackage(bump)
  }
})
