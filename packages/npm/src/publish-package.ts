import execa from 'execa'

export const publishPackage = (dir: string) => execa('npm', ['publish', dir])
