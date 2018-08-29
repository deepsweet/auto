import { TJsonMap } from 'typeon'

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

export type TBumpType = 'major' | 'minor' | 'patch'

export type TMessage = {
  type: TBumpType,
  prefix: string,
  value: string
}

export type TGitBump = {
  name: string,
  type: TBumpType,
  messages: TMessage[]
}

export type TPackageBump = {
  name: string,
  dir: string,
  version: string | null,
  type: TBumpType | null,
  deps: {
    [name: string]: string
  } | null,
  devDeps: {
    [name: string]: string
  } | null
}

export type TLog = {
  name: string,
  version: string,
  type: TBumpType,
  messages: TMessage[]
}
