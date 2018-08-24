import { dirname } from 'path'
import { getPackages } from '@auto/workspaces/src/'
import { getRemoteVersion } from './get-remote-version'
import { publishPackage } from './publish-package'

export const publishPackages = async () => {
  const packages = await getPackages()

  for (const { path, json } of Object.values(packages)) {
    const remoteVersion = await getRemoteVersion(json.name)

    if (remoteVersion !== json.version) {
      const packageDir = dirname(path)

      await publishPackage(packageDir)
    }
  }
}
