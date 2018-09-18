import test from 'blue-tape'
import { mock, unmock } from 'mocku'
// @ts-ignore
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/package.json`]: ''
})
const fs = createFsFromVolume(vol)

test('fs:getPackage', async (t) => {
  mock('../src/get-package', {
    [`${rootDir}/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0'
      }
    },
    fs
  })

  const { getPackage } = await import('../src/get-package')
  t.deepEquals(
    await getPackage(rootDir),
    {
      name: '@ns/a',
      version: '1.0.0'
    },
    'should get package content'
  )

  unmock('../src/get-package')
})