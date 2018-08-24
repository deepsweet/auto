import execa from 'execa'
import { TGitOptions } from './types'
import { TBumpStackItem } from '@auto/utils/src/'

const removeNamespace = (name: string, namespace: string) => {
  return name.replace(`@${namespace}/`, '')
}

export const writePublishCommit = async (packageName: string, bumpStackItem: TBumpStackItem, gitOptions: TGitOptions) => {
  const name = removeNamespace(packageName, gitOptions.namespace)
  const execaOptions = { stderr: process.stderr }

  if (bumpStackItem.type !== null && bumpStackItem.version !== null) {
    try {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${gitOptions.prefixes['publish']} ${name}: v${bumpStackItem.version}`,
          bumpStackItem.path
        ],
        execaOptions
      )

      await execa(
        'git',
        [
          'tag',
          '-m',
          `${name}@${bumpStackItem.version}`,
          `${name}@${bumpStackItem.version}`
        ],
        execaOptions
      )
    } catch (err) {
      throw null // eslint-disable-line no-throw-literal
    }
  }
}
