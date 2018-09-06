import { TJsonMap } from 'typeon'

export type TBumpType = 'major' | 'minor' | 'patch'

export type TOptionsPrefix = {
  title: string,
  value: string
}

export type TOptions = {
  semverPrefixes: {
    [key in TBumpType]: TOptionsPrefix
  },
  autoPrefixes: {
    publish: TOptionsPrefix,
    dependencies: TOptionsPrefix,
  }
  customPrefixes: TOptionsPrefix[],
  autoNamePrefix: string
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

export type TParsedMessageType = TBumpType | 'publish'

export type TParsedRepoMessage = {
  type: TParsedMessageType,
  message: string
}

export type TParsedWorkspacesMessage = {
  name: string
} & TParsedRepoMessage

export type TMessage = {
  type: TBumpType,
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
