import { TPackageJson } from '@auto/utils/src/'

export type TPackages = {
  [name: string]: {
    dir: string,
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
