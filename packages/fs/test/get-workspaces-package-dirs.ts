import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/fakes/a/package.json`]: '',
  [`${rootDir}/fakes/b/package.json`]: '',
  [`${rootDir}/fakes/c/package.json`]: ''
})
const fs = createFsFromVolume(vol)

test('fs:getWorkspacesPackageDirs no cross dependencies', async (t) => {
  mock('../src/get-workspaces-package-dirs', {
    [`${rootDir}/package.json`]: {
      workspaces: ['fakes/*']
    },
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/package.json`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
    fs
  })

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')
  t.deepEquals(
    await getWorkspacesPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/b`,
      `${rootDir}/fakes/c`
    ],
    'packages directories'
  )

  unmock('../src/get-workspaces-package-dirs')
})
