import execa from 'execa'

export const publishRepoPackage = async () => {
  await execa('npm', ['publish'], {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: null
  })
}
