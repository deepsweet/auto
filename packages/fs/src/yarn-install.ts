import execa from 'execa'

export const yarnInstall = async () => {
  await execa(
    'yarn',
    ['install'],
    {
      stdout: null,
      stderr: null
    }
  )
}
