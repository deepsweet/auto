import execa from 'execa'

export const publishRepoPackage = async () => {
  try {
    await execa('npm', ['publish'], {
      stdin: process.stdin,
      stdout: process.stdout,
      stderr: process.stderr
    })
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
