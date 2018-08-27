import execa from 'execa'
import { TPackageBump } from '@auto/utils/src'

export const publishPackage = async (bumpPackage: TPackageBump) => {
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
