import execa, { ExecaError } from 'execa'

export const getRemoteVersion = async (name: string) => {
  try {
    const { stdout } = await execa('npm', ['view', name, 'version'])

    return stdout
  } catch (err) {
    const { stderr } = err as ExecaError

    if (stderr.includes('code E404')) {
      return null
    }

    throw err
  }
}
