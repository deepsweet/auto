import execa from 'execa'
import { TWorkspacesPackageBump } from '@auto/utils/src'

export const publishWorkspacesPackage = async (bumpPackage: TWorkspacesPackageBump) => {
  try {
    await execa('npm', ['publish', bumpPackage.dir], {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    })
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
