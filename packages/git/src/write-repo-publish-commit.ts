import path from 'path'
import execa from 'execa'
import { TOptions, TRepoPackageBump } from '@auto/utils/src/'

export const writeRepoPublishCommit = async (packageBump: TRepoPackageBump, options: TOptions) => {
  const execaOptions = { stderr: process.stderr }
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  try {
    await execa(
      'git',
      [
        'commit',
        '-m',
        `${options.prefixes['publish']} v${packageBump.version}`,
        packageJsonPath
      ],
      execaOptions
    )
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
