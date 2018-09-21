import execa from 'execa'
import { getRepoPackage } from '@auto/fs/src'
import { TNpmOptions } from './types'

export const publishRepoPackage = async (npmOptions?: TNpmOptions) => {
  const packageJson = await getRepoPackage()
  const options = {
    registry: 'https://registry.npmjs.org/',
    ...(packageJson.publishConfig && packageJson.publishConfig.registry && {
      registry: packageJson.publishConfig.registry
    }),
    ...(npmOptions && npmOptions.registry && {
      registry: npmOptions.registry
    })
  }

  await execa('npm', ['publish', '--registry', options.registry, process.cwd()], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
