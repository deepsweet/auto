import { TGitOptions } from '../src/types'

export const gitOptions: TGitOptions = {
  prefixes: {
    patch: ['✔️'],
    minor: ['➕'],
    major: ['💥', '🚨'],
    publish: ['📦'],
    dependencies: ['♻️']
  },
  namespace: 'ns'
}
