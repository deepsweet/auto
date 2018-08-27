import { getPackages } from '@auto/workspaces/src/'
import { getRemoteVersion } from './get-remote-version'
import { publishPackage } from './publish-package'

export const publishPackages = async () => {
  const packages = await getPackages()

  for (const { dir, json } of Object.values(packages).reverse()) {
    const remoteVersion = await getRemoteVersion(json.name)

    if (remoteVersion !== json.version) {
      await publishPackage(dir)
    }
  }
}
