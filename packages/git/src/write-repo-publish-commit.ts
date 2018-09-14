import path from 'path'
import execa from 'execa'
import { TOptions, TRepoPackageBump } from '@auto/utils/src/'

export const writeRepoPublishCommit = async (packageBump: TRepoPackageBump, options: TOptions) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${options.requiredPrefixes.publish.value} v${packageBump.version}`,
      packageJsonPath
    ],
    {
      stdout: null,
      stderr: null
    }
  )
}
