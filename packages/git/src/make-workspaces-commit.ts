/* eslint-disable no-use-before-define */
import prompts from 'prompts'
import execa from 'execa'
import { TPackages, TOptions } from '@auto/utils/src/'

export const makeWorkspacesCommit = async (packages: TPackages, options: TOptions) => {
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

  const { packageName } = await prompts({
    type: 'autocomplete',
    name: 'packageName',
    message: 'Type package name',
    choices: Object.keys(packages).map((name) => ({ title: name, value: name }))
  }) as { packageName: string }

  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: 'Type commit message'
  }) as { message: string }

  let name = packageName.replace(/^@/, '')

  if (typeof options.namespace !== 'undefined') {
    name = name.replace(new RegExp(`^${options.namespace}/`), '')
  }

  const execaOptions = { stderr: process.stderr }

  try {
    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefix} ${name}: ${message}`
      ],
      execaOptions
    )
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
