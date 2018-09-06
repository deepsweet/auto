import execa from 'execa'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesPublishTag = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(new RegExp(`^${options.autoNamePrefix}`), '')
  const execaOptions = { stderr: process.stderr }

  if (packageBump.type !== null && packageBump.version !== null) {
    try {
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
