import execa from 'execa'
import { TGitOptions } from './types'
import { TBumpStack } from '@auto/utils/src/'

const removeNamespace = (name: string, namespace: string) => {
  return name.replace(`@${namespace}/`, '')
}

export const writeCommitsTags = async (bumps: TBumpStack, gitOptions: TGitOptions) => {
  for (const [nsName, bump] of Object.entries(bumps).reverse()) {
    const name = removeNamespace(nsName, gitOptions.namespace)

    if (bump.type !== null && bump.version !== null) {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${gitOptions.prefixes['publish']} ${name}: v${bump.version}`,
          bump.path
        ]
      )

      await execa(
        'git',
        [
          'tag',
          '-m',
          `${name}@${bump.version}`,
          `${name}@${bump.version}`
        ]
      )
    }
  }
}
