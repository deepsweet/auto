import path from 'path'
import execa from 'execa'
import { TPrefixes, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesPublishCommit = async (packageBump: TWorkspacesPackageBump, prefixes: TPrefixes) => {
  if (packageBump.type !== null && packageBump.version !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')

    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefixes.required.publish.value} ${packageBump.name}: v${packageBump.version}`,
        packageJsonPath
      ],
      {
        stdout: null,
        stderr: null
      }
    )
  }
}
