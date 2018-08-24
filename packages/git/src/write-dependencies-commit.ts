import execa from 'execa'
import { TGitOptions } from './types'
import { TPackageBump } from '@auto/utils/src/'

export const writeDependenciesCommit = async (packageBump: TPackageBump, gitOptions: TGitOptions) => {
  const name = packageBump.name.replace(`@${gitOptions.namespace}/`, '')
  const execaOptions = { stderr: process.stderr }

  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    try {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${gitOptions.prefixes['dependencies']} ${name}: upgrade dependencies`,
          packageBump.path
        ],
        execaOptions
      )
    } catch (err) {
      throw null // eslint-disable-line no-throw-literal
    }
  }
}
