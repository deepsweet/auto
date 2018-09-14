import execa from 'execa'
import { TWorkspacesPackageBump } from '@auto/utils/src/'
import { getRepoPackage } from '@auto/fs/src'
import { TPublishOptions } from './types'

export const publishWorkspacesPackage = async (bumpPackage: TWorkspacesPackageBump, userOptions?: TPublishOptions) => {
  const packageJson = await getRepoPackage()
  const options = {
    registry: 'https://registry.npmjs.org/',
    ...(packageJson.publishConfig && packageJson.publishConfig.registry && {
      registry: packageJson.publishConfig.registry
    }),
    ...userOptions
  }

  await execa('npm', ['publish', 'registry', options.registry, bumpPackage.dir], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
