export type TCommitPrefixType = 'major' | 'minor' | 'patch' | 'publish'

export type TGitOptions = {
  prefixes: {
    [key in TCommitPrefixType]: string[]
  },
  namespace: string
}
