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
