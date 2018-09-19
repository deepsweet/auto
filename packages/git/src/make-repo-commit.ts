/* eslint-disable no-use-before-define */
// @ts-ignore
import prompts from 'prompts'
import execa from 'execa'
import { TOptions } from '@auto/utils/src/'

export const makeRepoCommit = async (options: TOptions) => {
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
    ],
    initial: 1
  }) as { prefix?: string }

  if (typeof prefix === 'undefined') {
    throw new Error('Change type is required')
  }

  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: 'Type commit message'
  }) as { message?: string }

  if (typeof message === 'undefined') {
    throw new Error('Commit message is required')
  }

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefix} ${message}`
    ],
    {
      stdout: process.stdout,
      stderr: null
    }
  )
}
