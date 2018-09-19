/* eslint-disable no-use-before-define */
// @ts-ignore
import prompts from 'prompts'
import execa from 'execa'
import { TPackages, TOptions, removeAutoNamePrefix } from '@auto/utils/src/'
import { suggestFilter } from './suggest-filter'

export const makeWorkspacesCommit = async (packages: TPackages, options: TOptions) => {
  const { prefix } = await prompts({
    type: 'select',
    name: 'prefix',
    message: 'Select change type',
    choices: [
      options.requiredPrefixes.major,
      options.requiredPrefixes.minor,
      options.requiredPrefixes.patch,
      options.requiredPrefixes.initial,
      ...options.customPrefixes
    ]
  }) as { prefix?: string }

  if (typeof prefix === 'undefined') {
    throw new Error('Change type is required')
  }

  const packageNames: string [] = []

  while (true) {
    const { packageName } = await prompts({
      type: 'autocomplete',
      name: 'packageName',
      message: 'Type package name',
      limit: 20,
      choices: Object.keys(packages)
        .filter((name) => !packageNames.includes(name))
        .map((name) => ({ title: name, value: name })),
      suggest: suggestFilter(packageNames.length > 0 ? '(done)' : '(no package)')
    }) as { packageName?: string }

    if (typeof packageName === 'undefined') {
      throw new Error('Package name is required')
    }

    if (packageName === '-') {
      break
    }

    packageNames.push(packageName)

    if (packageName === '*') {
      break
    }
  }

  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: 'Type commit message'
  }) as { message?: string }

  if (typeof message === 'undefined') {
    throw new Error('Commit message is required')
  }

  let name = ''

  if (packageNames.length > 0) {
    name = packageNames
      .map((packageName) => removeAutoNamePrefix(packageName, options.autoNamePrefix))
      .join(', ')
    name += ': '
  }

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefix} ${name}${message}`
    ],
    {
      stdout: process.stdout,
      stderr: null
    }
  )
}
