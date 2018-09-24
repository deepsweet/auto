import { TPackages, TWorkspacesOptions } from '@auto/utils/src/'
import { getCrossDependents } from './get-cross-dependents'
import { TDependent } from './types'

export const getDependentsOf = (packages: TPackages, name: string, options: TWorkspacesOptions) =>
  (Reflect.get(getCrossDependents(packages, options), name) || null) as TDependent[] | null
