import execa from 'execa'
import { TWorkspacesPackageBump, TOptions } from '@auto/utils/src/'
import { getRepoPackage } from '@auto/fs/src'

export const publishWorkspacesPackage = async (bumpPackage: TWorkspacesPackageBump, userOptions: TOptions) => {
  const packageJson = await getRepoPackage()
  const options = {
    registry: 'https://registry.npmjs.org/',
    ...(packageJson.publishConfig && packageJson.publishConfig.registry && {
      registry: packageJson.publishConfig.registry
    }),
    ...(userOptions.npm && userOptions.npm.registry && {
      registry: userOptions.npm.registry
    })
  }

  await execa('npm', ['publish', '--registry', options.registry, bumpPackage.dir], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
