/* eslint-disable no-use-before-define */
import prompts from 'prompts'
import execa from 'execa'
import { TPackages, TOptions } from '@auto/utils/src/'

export const makeRepoCommit = async (options: TOptions) => {
  const { prefix } = await prompts({
    type: 'select',
    name: 'prefix',
    message: 'Select change type',
    choices: [
      options.semverPrefixes.major,
      options.semverPrefixes.minor,
      options.semverPrefixes.patch,
      ...options.customPrefixes
    ],
    initial: 1
  }) as { prefix: string }

  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: 'Type commit message'
  }) as { message: string }

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
