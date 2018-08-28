import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('writePackageVersion: single version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-package-version', {
    [`${rootDir}/fakes/a/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0'
      }
    },
    fs
  })

  const { writePackageVersion } = await import('../src/write-package-version')

  await writePackageVersion({
    name: '@ns/a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    messages: null,
    deps: null,
    devDeps: null
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

  unmock('../src/write-package-version')
})

test('writePackageVersion: ignore dependencies', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-package-version', {
    [`${rootDir}/fakes/a/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0',
        dependencies: {
          '@ns/b': '0.0.1',
          '@ns/c': '0.0.2'
        }
      }
    },
    fs
  })

  const { writePackageVersion } = await import('../src/write-package-version')

  await writePackageVersion({
    name: '@ns/a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    messages: null,
    deps: {
      '@ns/b': '0.0.2',
      '@ns/c': '0.0.3'
    },
    devDeps: null
  })

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8')
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1',
      dependencies: {
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2'
      }
    },
    'should write version, and skip dependencies'
  )

  unmock('../src/write-package-version')
})

test('writePackageVersion: ignore devDependencies', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-package-version', {
    [`${rootDir}/fakes/a/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0',
        devDependencies: {
          '@ns/b': '0.0.1',
          '@ns/c': '0.0.2'
        }
      }
    },
    fs
  })

  const { writePackageVersion } = await import('../src/write-package-version')

  await writePackageVersion({
    name: '@ns/a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    messages: null,
    deps: null,
    devDeps: {
      '@ns/b': '0.0.2',
      '@ns/c': '0.0.3'
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
        '@ns/b': '0.0.1',
        '@ns/c': '0.0.2'
      }
    },
    'should write version, and skip devDependencies'
  )

  unmock('../src/write-package-version')
})

test('writePackageVersion: no version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0'
    })
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-package-version', {
    [`${rootDir}/fakes/a/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0'
      }
    },
    fs
  })

  const { writePackageVersion } = await import('../src/write-package-version')

  await writePackageVersion({
    name: '@ns/a',
    dir: `${rootDir}/fakes/a`,
    version: null,
    type: null,
    messages: null,
    deps: null,
    devDeps: null
  })

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8')
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0'
    },
    'should not write version'
  )

  unmock('../src/write-package-version')
})
