import { TPackages } from '@auto/utils/src/'
import { getCrossDependents } from './get-cross-dependents'
import { TDependent } from './types'

export const getDependentsOf = (packages: TPackages, name: string) =>
  (Reflect.get(getCrossDependents(packages), name) || null) as TDependent[] | null
