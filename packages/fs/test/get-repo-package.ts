import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/package.json`]: ''
})
const fs = createFsFromVolume(vol)

test('fs:getRepoPackage no cross dependencies', async (t) => {
  mock('../src/get-repo-package', {
    [`${rootDir}/package.json`]: {
      name: '@ns/a',
      version: '1.0.0'
    },
    fs
  })

  const { getRepoPackage } = await import('../src/get-repo-package')
  t.deepEquals(
    await getRepoPackage(),
    {
      name: '@ns/a',
      version: '1.0.0'
    },
    'packages directories'
  )

  unmock('../src/get-repo-package')
})
