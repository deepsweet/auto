import path from 'path'
import execa from 'execa'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesPublishCommit = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(new RegExp(`^${options.autoNamePrefix}`), '')

  if (packageBump.type !== null && packageBump.version !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')

    await execa(
      'git',
      [
        'commit',
        '-m',
        `${options.requiredPrefixes.publish.value} ${name}: v${packageBump.version}`,
        packageJsonPath
      ],
      {
        stdout: null,
        stderr: null
      }
    )
  }
}
