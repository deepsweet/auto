import execa from 'execa'
import { TGitOptions } from './types'
import { TPackageBump } from '@auto/utils/src/'

export const writePublishCommit = async (packageBump: TPackageBump, gitOptions: TGitOptions) => {
  const name = packageBump.name.replace(`@${gitOptions.namespace}/`, '')
  const execaOptions = { stderr: process.stderr }

  if (packageBump.type !== null && packageBump.version !== null) {
    try {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${gitOptions.prefixes['publish']} ${name}: v${packageBump.version}`,
          packageBump.path
        ],
        execaOptions
      )

      await execa(
        'git',
        [
          'tag',
          '-m',
          `${name}@${packageBump.version}`,
          `${name}@${packageBump.version}`
        ],
        execaOptions
      )
    } catch (err) {
      throw null // eslint-disable-line no-throw-literal
    }
  }
}
