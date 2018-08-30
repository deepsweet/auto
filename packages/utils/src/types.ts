import { TJsonMap } from 'typeon'

export type TCommitPrefixType = 'major' | 'minor' | 'patch' | 'publish' | 'dependencies'

export type TOptions = {
  prefixes: {
    [key in TCommitPrefixType]: string[]
  },
  namespace: string
}

export type TPackageJson = {
  name: string,
  version: string,
  dependencies?: {
    [k: string]: string
  },
  devDependencies?: {
    [k: string]: string
  }
} & TJsonMap

export type TPackages = {
  [name: string]: {
    dir: string,
    json: TPackageJson
  }
}

export type TBumpType = 'major' | 'minor' | 'patch'

export type TMessage = {
  type: TBumpType,
  prefix: string,
  value: string
}

export type TGitRepoBump = {
  type: TBumpType,
  messages: TMessage[]
}

export type TGitWorkspacesBump = {
  name: string,
} & TGitRepoBump

export type TRepoPackageBump = {
  type: TBumpType,
  version: string,
}

export type TWorkspacesPackageBump = {
  name: string,
  type: TBumpType | null,
  version: string | null,
  dir: string,
  deps: {
    [name: string]: string
  } | null,
  devDeps: {
    [name: string]: string
  } | null
}

export type TWorkspacesLog = {
  version: string
} & TGitWorkspacesBump
