import execa from 'execa'
import path from 'path'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesDependenciesCommit = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(new RegExp(`^${options.autoNamePrefix}`), '')

  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')
    const yarnLockPath = path.resolve('yarn.lock')
    const prefix = options.requiredPrefixes.dependencies.value

    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefix} ${name}: upgrade dependencies`,
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
