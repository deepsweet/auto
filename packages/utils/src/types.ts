import { TJsonMap } from 'typeon'

export type TBumpType = 'major' | 'minor' | 'patch'

export type TOptionsPrefix = {
  title: string,
  value: string
}

export type TOptions = {
  requiredPrefixes: {
    major: TOptionsPrefix,
    minor: TOptionsPrefix,
    patch: TOptionsPrefix,
    publish: TOptionsPrefix,
    dependencies: TOptionsPrefix,
    initial: TOptionsPrefix
  },
  customPrefixes: TOptionsPrefix[],
  autoNamePrefix: string,
  zeroBreakingChangeType: TBumpType,
  initialType: TBumpType,
  github?: {
    username: string,
    repo: string
  },
  slack?: {
    channel: string,
    username: string,
    iconEmoji: string,
    colors: {
      major: string,
      minor: string,
      patch: string
    }
  }
}

export type TPackageJson = {
  name: string,
  version: string,
  dependencies?: {
    [k: string]: string
  },
  devDependencies?: {
    [k: string]: string
  },
  workspaces?: string[] | {
    packages: string[],
  },
  publishConfig?: {
    registry?: string
  }
} & TJsonMap

export type TPackages = {
  [name: string]: {
    dir: string,
    json: TPackageJson
  }
}

export type TParsedMessageType = TBumpType | 'publish' | 'initial'

export type TRepoParsedMessage = {
  type: TParsedMessageType,
  message: string
}

export type TWorkspacesParsedMessage = {
  names: string[]
} & TRepoParsedMessage

export type TGitMessageType = TBumpType | 'initial'

export type TGitMessage = {
  type: TGitMessageType,
  value: string
}

export type TRepoGitBump = {
  type: TBumpType,
  messages: TGitMessage[]
}

export type TWorkspacesGitBump = {
  name: string,
} & TRepoGitBump

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

export type TWorkspacesLogMessage = {
  type: TBumpType | 'dependencies' | 'initial',
  value: string
}

export type TWorkspacesLog = {
  name: string,
  version: string,
  type: TBumpType,
  messages: TWorkspacesLogMessage[]
}

export type TRepoLogMessage = TGitMessage

export type TRepoLog = {
  version: string,
  type: TBumpType,
  messages: TRepoLogMessage[]
}
