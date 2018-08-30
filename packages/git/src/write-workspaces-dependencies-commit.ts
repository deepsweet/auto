import execa from 'execa'
import path from 'path'
import { TOptions, TWorkspacesPackageBump } from '@auto/utils/src/'

export const writeWorkspacesDependenciesCommit = async (packageBump: TWorkspacesPackageBump, options: TOptions) => {
  const name = packageBump.name.replace(`@${options.namespace}/`, '')
  const execaOptions = { stderr: process.stderr }

  if (packageBump.deps !== null || packageBump.devDeps !== null) {
    const packageJsonPath = path.join(packageBump.dir, 'package.json')
    const prefix = packageBump.type !== null ? packageBump.type : 'dependencies'

    try {
      await execa(
        'git',
        [
          'commit',
          '-m',
          `${options.prefixes[prefix]} ${name}: upgrade dependencies`,
          packageJsonPath
        ],
        execaOptions
      )
    } catch (err) {
      throw null // eslint-disable-line no-throw-literal
    }
  }
}
