import test from 'blue-tape'
import { mock, unmock } from 'mocku'
// @ts-ignore
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()

test('fs:writeRepoPackageVersion: single version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-repo-package-version', {
    [`${rootDir}/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0'
      }
    },
    fs
  })

  const { writeRepoPackageVersion } = await import('../src/write-repo-package-version')

  await writeRepoPackageVersion({
    version: '1.0.1',
    type: 'patch'
  })

  const packageData = fs.readFileSync(`${rootDir}/package.json`, 'utf8')
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.1'
    },
    'should write bumps'
  )

  unmock('../src/write-repo-package-version')
})

test('fs:riteRepoPackageVersion: ignore dependencies', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-repo-package-version', {
    [`${rootDir}/package.json`]: {
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

  const { writeRepoPackageVersion } = await import('../src/write-repo-package-version')

  await writeRepoPackageVersion({
    version: '1.0.1',
    type: 'patch'
  })

  const packageData = fs.readFileSync(`${rootDir}/package.json`, 'utf8')
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

  unmock('../src/write-repo-package-version')
})

test('fs:writeRepoPackageVersion: ignore devDependencies', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)

  mock('../src/write-repo-package-version', {
    [`${rootDir}/package.json`]: {
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

  const { writeRepoPackageVersion } = await import('../src/write-repo-package-version')

  await writeRepoPackageVersion({
    version: '1.0.1',
    type: 'patch'
  })

  const packageData = fs.readFileSync(`${rootDir}/package.json`, 'utf8')
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

  unmock('../src/write-repo-package-version')
})
