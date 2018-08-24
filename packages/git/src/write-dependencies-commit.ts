import execa from 'execa'
import { TGitOptions } from './types'
import { TBumpStackItem } from '@auto/utils/src/'

const removeNamespace = (name: string, namespace: string) => {
  return name.replace(`@${namespace}/`, '')
}

export const writeDependenciesCommit = async (packageName: string, bumpStackItem: TBumpStackItem, gitOptions: TGitOptions) => {
  const name = removeNamespace(packageName, gitOptions.namespace)
  const execaOptions = { stderr: process.stderr }

  if (bumpStackItem.deps !== null || bumpStackItem.devDeps !== null) {
    try {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${gitOptions.prefixes['dependencies']} ${name}: upgrade dependencies`,
          bumpStackItem.path
        ],
        execaOptions
      )
    } catch (err) {
      throw null // eslint-disable-line no-throw-literal
    }
  }
}
