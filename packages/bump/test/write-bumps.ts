import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('writeBumps: single version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-bumps', {
    [`${rootDir}/fakes/a/package.json`]: {
      name: '@ns/a',
      version: '1.0.0'
    },
    fs
  })

  const { default: writeBumps } = await import('../src/write-bumps')

  await writeBumps({
    '@ns/a': {
      path: `${rootDir}/fakes/a/package.json`,
      version: '1.0.1',
      type: null,
      deps: null,
      devDeps: null
    }
  })

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8')
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1'
    },
    'should write bumps'
  )

  unmock('../src/write-bumps')
})

test('writeBumps: multiple dependencies bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-bumps', {
    [`${rootDir}/fakes/a/package.json`]: {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2'
      }
    },
    fs
  })

  const { default: writeBumps } = await import('../src/write-bumps')

  await writeBumps({
    '@ns/a': {
      path: `${rootDir}/fakes/a/package.json`,
      version: '1.0.1',
      type: null,
      deps: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3'
      },
      devDeps: null
    }
  })

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8')
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1',
      dependencies: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3'
      }
    },
    'should write bumps'
  )

  unmock('../src/write-bumps')
})

test('writeBumps: multiple dev dependencies bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-bumps', {
    [`${rootDir}/fakes/a/package.json`]: {
      name: '@ns/a',
      version: '1.0.0',
      devDependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2'
      }
    },
    fs
  })

  const { default: writeBumps } = await import('../src/write-bumps')

  await writeBumps({
    '@ns/a': {
      path: `${rootDir}/fakes/a/package.json`,
      version: '1.0.1',
      type: null,
      deps: null,
      devDeps: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3'
      }
    }
  })

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8')
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1',
      devDependencies: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3'
      }
    },
    'should write bumps'
  )

  unmock('../src/write-bumps')
})

test('writeBumps: everything', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: '',
    [`${rootDir}/fakes/b/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-bumps', {
    [`${rootDir}/fakes/a/package.json`]: {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@ns/b': '0.0.1'
      },
      devDependencies: {
        '@ns/c': '0.0.2'
      }
    },
    [`${rootDir}/fakes/b/package.json`]: {
      name: '@ns/b',
      version: '2.0.0',
      dependencies: {
        '@ns/a': '0.1.0'
      },
      devDependencies: {
        '@ns/c': '0.2.0'
      }
    },
    fs
  })

  const { default: writeBumps } = await import('../src/write-bumps')

  await writeBumps({
    '@ns/a': {
      path: `${rootDir}/fakes/a/package.json`,
      version: null,
      type: null,
      deps: {
        '@ns/b': '0.0.2'
      },
      devDeps: {
        '@ns/c': '0.0.3'
      }
    },
    '@ns/b': {
      path: `${rootDir}/fakes/b/package.json`,
      version: '2.0.1',
      type: null,
      deps: {
        '@ns/a': '0.2.0'
      },
      devDeps: {
        '@ns/c': '0.3.0'
      }
    }
  })

  const packageAData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8')
  const packageAJson = JSON.parse(packageAData)

  t.deepEquals(
    packageAJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@ns/b': '0.0.2'
      },
      devDependencies: {
        '@ns/c': '0.0.3'
      }
    },
    'should write bump A'
  )

  const packageBData = fs.readFileSync(`${rootDir}/fakes/b/package.json`, 'utf8')
  const packageBJson = JSON.parse(packageBData)

  t.deepEquals(
    packageBJson,
    {
      name: '@ns/b',
      version: '2.0.1',
      dependencies: {
        '@ns/a': '0.2.0'
      },
      devDependencies: {
        '@ns/c': '0.3.0'
      }
    },
    'should write bump B'
  )

  unmock('../src/write-bumps')
})
