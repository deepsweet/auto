import execa from 'execa'
import path from 'path'
import { TPrefixes, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesDependenciesCommit = async (packageBumps: TWorkspacesPackageBump[], prefixes: TPrefixes) => {
  const bumps = packageBumps.filter((bump) => bump.deps !== null || bump.devDeps !== null)
  const packageJsonPaths = bumps.map((bump) => path.join(bump.dir, 'package.json'))

  if (bumps.length > 0) {
    await execa(
      'git',
      [
        'commit',
        '-m',
        `${prefixes.required.dependencies.value} upgrade dependencies`,
        ...packageJsonPaths
      ],
      {
        stdout: null,
        stderr: null
      }
    )
  }
}
