import execa from 'execa'

export const publishPackage = async (dir: string) => {
  try {
    await execa('npm', ['publish', dir], {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    })
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
