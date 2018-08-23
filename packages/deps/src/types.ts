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

export type TPackages = {
  [name: string]: {
    path: string,
    json: TPackageJson
  }
}

export type TDependent = {
  name: string,
  range: string | null,
  devRange: string | null
}

export type TCrossDependents = {
  [name: string]: TDependent[]
}
