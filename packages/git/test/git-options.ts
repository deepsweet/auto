import { TGitOptions } from '../src/types'

const gitOptions: TGitOptions = {
  prefixes: {
    patch: ['✔️'],
    minor: ['➕'],
    major: ['💥', '🚨'],
    publish: ['📦']
  },
  namespace: 'ns'
}

export default gitOptions
