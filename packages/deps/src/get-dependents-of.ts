import getCrossDependents from './get-cross-dependents'
import { TPackages, TDependent } from './types'

const getDependentsOf = (packages: TPackages, name: string) =>
  (Reflect.get(getCrossDependents(packages), name) || null) as TDependent[] | null

export default getDependentsOf
