import execa from 'execa'
import path from 'path'
import { TPrefixes, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesDependenciesCommit = async (packageBump: TWorkspacesPackageBump, prefixes: TPrefixes) => {
  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')
    const prefix = prefixes.required.dependencies.value

    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefix} ${packageBump.name}: upgrade dependencies`,
        packageJsonPath
      ],
      {
        stdout: null,
        stderr: null
      }
    )
  }
}
