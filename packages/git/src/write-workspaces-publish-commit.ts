import path from 'path'
import execa from 'execa'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesPublishCommit = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(new RegExp(`^${options.autoNamePrefix}`), '')
  const execaOptions = { stderr: process.stderr }

  if (packageBump.type !== null && packageBump.version !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')

    try {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${options.autoPrefixes.publish.value} ${name}: v${packageBump.version}`,
          packageJsonPath
        ],
        execaOptions
      )
    } catch (err) {
      throw null // eslint-disable-line no-throw-literal
    }
  }
}