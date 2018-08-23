import { compareReleaseTypes, TBump, TBumpType } from '@auto/utils/src/'
import { getCommitMessages } from './get-commit-messages'
import parseCommitMessage from './parse-commit-message'
import { TGitOptions } from './types'

type TGitBumps = {
  [key: string]: TBumpType
}

const getBumps = async (options: TGitOptions): Promise<TBump[]> => {
  const messages = await getCommitMessages()
  const bumps: TGitBumps = {}
  const completedPackages: string[] = []

  for (const message of messages) {
    const parsed = parseCommitMessage(message, options)

    if (parsed === null) {
      continue
    }

    if (completedPackages.includes(parsed.package)) {
      continue
    }

    if (parsed.type === 'publish') {
      completedPackages.push(parsed.package)
      continue
    }

    if (Reflect.has(bumps, parsed.package)) {
      if (compareReleaseTypes(parsed.type, bumps[parsed.package]) > 0) {
        bumps[parsed.package] = parsed.type
      }
    } else {
      bumps[parsed.package] = parsed.type
    }
  }

  return Object.entries(bumps).reduce((res, [name, type]) => {
    return res.concat({
      name,
      type
    })
  }, [] as TBump[])
}

export default getBumps
