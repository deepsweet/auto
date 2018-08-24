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

export type TBump = {
  name: string,
  type: TBumpType
}

export type TBumpStack = {
  [name: string]: {
    path: string,
    version: string | null,
    type: TBumpType | null,
    deps: {
      [name: string]: string
    } | null,
    devDeps: {
      [name: string]: string
    } | null
  }
}

export type TChangelog = {
  name: string,
  messages: string[]
}
