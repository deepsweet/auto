import execa from 'execa'
import { TRepoPackageBump } from '@auto/utils/src/'

export const writeRepoPublishTag = async (packageBump: TRepoPackageBump) => {
  const execaOptions = { stderr: process.stderr }

  try {
    await execa(
      'git',
      [
        'tag',
        '-m',
        `v${packageBump.version}`,
        `v${packageBump.version}`
      ],
      execaOptions
    )
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
