import execa from 'execa'
import { TPublishOptions } from './types'
import { getRepoPackage } from '@auto/fs/src'

export const publishRepoPackage = async (userOptions?: TPublishOptions) => {
  const packageJson = await getRepoPackage()
  const options = {
    registry: 'https://registry.npmjs.org/',
    ...(packageJson.publishConfig && packageJson.publishConfig.registry && {
      registry: packageJson.publishConfig.registry
    }),
    ...userOptions
  }

  await execa('npm', ['publish', 'registry', options.registry, process.cwd()], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
