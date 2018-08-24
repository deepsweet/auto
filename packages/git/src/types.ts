export type TCommitPrefixType = 'major' | 'minor' | 'patch' | 'publish' | 'dependencies'

export type TGitOptions = {
  prefixes: {
    [key in TCommitPrefixType]: string[]
  },
  namespace: string
}
