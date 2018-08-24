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

test('workspace:getPackageDirs no cross dependencies', async (t) => {
  mock('../src/get-package-dirs', {
    [`${rootDir}/package.json`]: {
      workspaces: ['fakes/*']
    },
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/package.json`]: '',
    [`${rootDir}/fakes/c/package.json`]: '',
    fs
  })

  const { getPackageDirs } = await import('../src/get-package-dirs')
  t.deepEquals(
    await getPackageDirs(),
    [
      `${rootDir}/fakes/a`,
      `${rootDir}/fakes/b`,
      `${rootDir}/fakes/c`
    ],
    'packages directories'
  )

  unmock('../src/get-package-dirs')
})
