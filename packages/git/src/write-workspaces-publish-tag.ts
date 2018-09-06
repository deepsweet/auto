import execa from 'execa'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesPublishTag = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(new RegExp(`^${options.autoNamePrefix}`), '')

  if (packageBump.type !== null && packageBump.version !== null) {
    await execa(
      'git',
      [
        'tag',
        '-m',
        `${name}@${packageBump.version}`,
        `${name}@${packageBump.version}`
      ],
      {
        stdout: process.stdout,
        stderr: null
      }
    )
  }
}
