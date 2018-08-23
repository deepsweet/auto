import execa from 'execa'

const publishPackage = (dir: string) => execa('npm', ['publish', dir])

export default publishPackage
