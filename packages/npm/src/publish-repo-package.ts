import execa from 'execa'
import { getRepoPackage } from '@auto/fs/src'
import { TOptions } from '@auto/utils/src'

export const publishRepoPackage = async (userOptions: TOptions) => {
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

  await execa('npm', ['publish', '--registry', options.registry, process.cwd()], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
