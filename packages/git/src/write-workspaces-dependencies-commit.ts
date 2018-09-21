import execa from 'execa'
import path from 'path'
import { TPrefixes, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesDependenciesCommit = async (packageBump: TWorkspacesPackageBump, prefixes: TPrefixes) => {
  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')
    const yarnLockPath = path.resolve('yarn.lock')
    const prefix = prefixes.required.dependencies.value

    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefix} ${packageBump.name}: upgrade dependencies`,
        packageJsonPath,
        yarnLockPath
      ],
      {
        stdout: null,
        stderr: null
      }
    )
  }
}
