import execa from 'execa'
import { TWorkspacesPackageBump } from '@auto/utils/src/'

export const publishWorkspacesPackage = async (bumpPackage: TWorkspacesPackageBump) => {
  await execa('npm', ['publish', bumpPackage.dir], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
