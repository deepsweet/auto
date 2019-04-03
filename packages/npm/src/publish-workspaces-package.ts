import execa from 'execa'
import path from 'path'
import { TWorkspacesPackageBump } from '@auto/utils/src/'
import { getRepoPackage } from '@auto/fs/src'
import { TNpmOptions } from './types'

export const publishWorkspacesPackage = async (bumpPackage: TWorkspacesPackageBump, npmOptions?: TNpmOptions) => {
  const packageJson = await getRepoPackage()
  const options = {
    registry: 'https://registry.npmjs.org/',
    subDirectory: '',
    ...(packageJson.publishConfig && packageJson.publishConfig.registry && {
      registry: packageJson.publishConfig.registry
    }),
    ...(npmOptions && npmOptions.registry && {
      registry: npmOptions.registry
    }),
    ...(npmOptions && npmOptions.publishSubDirectory && {
      subDirectory: npmOptions.publishSubDirectory
    })
  }

  await execa('npm', ['publish', '--registry', options.registry, path.join(bumpPackage.dir, options.subDirectory)], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
