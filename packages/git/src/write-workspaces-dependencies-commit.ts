import execa from 'execa'
import path from 'path'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesDependenciesCommit = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(new RegExp(`^${options.autoNamePrefix}`), '')

  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')
    const prefix = packageBump.type !== null
      ? options.semverPrefixes[packageBump.type].value
      : options.autoPrefixes.dependencies.value

    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefix} ${name}: upgrade dependencies`,
        packageJsonPath
      ],
      {
        stdout: process.stdout,
        stderr: null
      }
    )
  }
}
