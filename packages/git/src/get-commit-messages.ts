import execa from 'execa'

export const getCommitMessages = async (): Promise<string[]> => {
  try {
    const { stdout } = await execa('git', ['log', '--pretty=format:%s'], {
      stderr: process.stderr
    })

    return stdout.split('\n')
  } catch (err) {
    throw null // eslint-disable-line no-throw-literal
  }
}
