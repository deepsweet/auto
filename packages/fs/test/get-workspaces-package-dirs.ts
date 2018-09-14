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

test('fs:getWorkspacesPackageDirs workspaces[]', async (t) => {
  mock('../src/get-workspaces-package-dirs', {
    [`${rootDir}/package.json`]: {
      default: {
        workspaces: ['fakes/*']
      }
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
    'should return packages directories'
  )

  unmock('../src/get-workspaces-package-dirs')
})

test('fs:getWorkspacesPackageDirs workspaces.packages[]', async (t) => {
  mock('../src/get-workspaces-package-dirs', {
    [`${rootDir}/package.json`]: {
      default: {
        workspaces: {
          packages: ['fakes/*']
        }
      }
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
    'should return packages directories'
  )

  unmock('../src/get-workspaces-package-dirs')
})

test('fs:getWorkspacesPackageDirs no workspaces', async (t) => {
  mock('../src/get-workspaces-package-dirs', {
    [`${rootDir}/package.json`]: {
      default: {}
    },
    fs
  })

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')

  try {
    await getWorkspacesPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, '`workspaces` field in `package.json` is required')
  }

  unmock('../src/get-workspaces-package-dirs')
})

test('fs:getWorkspacesPackageDirs no workspaces.packages', async (t) => {
  mock('../src/get-workspaces-package-dirs', {
    [`${rootDir}/package.json`]: {
      default: {
        workspaces: {}
      }
    },
    fs
  })

  const { getWorkspacesPackageDirs } = await import('../src/get-workspaces-package-dirs')

  try {
    await getWorkspacesPackageDirs()

    t.fail('should not get here')
  } catch (e) {
    t.equals(e.message, '`workspaces.packages` field in `package.json` is required')
  }

  unmock('../src/get-workspaces-package-dirs')
})
