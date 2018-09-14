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

test('fs:getWorkspacesPackages workspaces[]', async (t) => {
  mock('../src/get-workspaces-packages', {
    [`${rootDir}/package.json`]: {
      default: {
        workspaces: ['fakes/*']
      }
    },
    [`${rootDir}/fakes/a/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0'
      }
    },
    [`${rootDir}/fakes/b/package.json`]: {
      default: {
        name: '@ns/b',
        version: '2.0.0'
      }
    },
    [`${rootDir}/fakes/c/package.json`]: {
      default: {
        name: '@ns/c',
        version: '3.0.0'
      }
    },
    fs
  })

  const { getWorkspacesPackages } = await import('../src/get-workspaces-packages')
  t.deepEquals(
    await getWorkspacesPackages(),
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
    'should return packages'
  )

  unmock('../src/get-workspaces-packages')
})
