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

test('workspace:getPackages no cross dependencies', async (t) => {
  mock('../src/get-packages', {
    [`${rootDir}/package.json`]: {
      workspaces: ['fakes/*']
    },
    [`${rootDir}/fakes/a/package.json`]: {
      name: '@ns/a',
      version: '1.0.0'
    },
    [`${rootDir}/fakes/b/package.json`]: {
      name: '@ns/b',
      version: '2.0.0'
    },
    [`${rootDir}/fakes/c/package.json`]: {
      name: '@ns/c',
      version: '3.0.0'
    },
    fs
  })

  const { getPackages } = await import('../src/get-packages')
  t.deepEquals(
    await getPackages(),
    {
      '@ns/a': {
        dir: `${rootDir}/fakes/a`,
        json: {
          name: '@ns/a',
          version: '1.0.0'
        }
      },
      '@ns/b': {
        dir: `${rootDir}/fakes/b`,
        json: {
          name: '@ns/b',
          version: '2.0.0'
        }
      },
      '@ns/c': {
        dir: `${rootDir}/fakes/c`,
        json: {
          name: '@ns/c',
          version: '3.0.0'
        }
      }
    },
    'packages directories'
  )

  unmock('../src/get-packages')
})
