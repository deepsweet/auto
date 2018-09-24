import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'
import { createSpy, getSpyCalls } from 'spyfn'
import { TWorkspacesOptions } from '@auto/utils/src'

const options: TWorkspacesOptions = {
  autoNamePrefix: '@ns/'
}
const rootDir = process.cwd()

test('fs:writePackageDependencies: ignore version bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: JSON.stringify({
      name: '@ns/a',
      version: '1.0.0'
    })
  })
  const fs = createFsFromVolume(vol)
  const yarnSpy = createSpy(() => Promise.resolve())

  mock('../src/write-package-dependencies', {
    './yarn-install': {
      yarnInstall: yarnSpy
    },
    [`${rootDir}/fakes/a/package.json`]: {
      default: {
        name: '@ns/a',
        version: '1.0.0'
      }
    },
    fs
  })

  const { writePackageDependencies } = await import('../src/write-package-dependencies')

  await writePackageDependencies({
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    deps: null,
    devDeps: null
  }, options)

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0'
    },
    'should ignore version'
  )

  t.deepEquals(
    getSpyCalls(yarnSpy),
    [],
    'should not call yarn install'
  )

  unmock('../src/write-package-dependencies')
})

test('fs:writePackageDependencies: multiple dependencies bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)
  const yarnSpy = createSpy(() => Promise.resolve())

  mock('../src/write-package-dependencies', {
    './yarn-install': {
      yarnInstall: yarnSpy
    },
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

  const { writePackageDependencies } = await import('../src/write-package-dependencies')

  await writePackageDependencies({
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    deps: {
      'b': '0.0.2',
      'c': '0.0.3'
    },
    devDeps: null
  }, options)

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      dependencies: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3'
      }
    },
    'should write bumps, and ignore version'
  )

  t.deepEquals(
    getSpyCalls(yarnSpy),
    [
      []
    ],
    'should call yarn install'
  )

  unmock('../src/write-package-dependencies')
})

test('fs:writePackageDependencies: multiple dev dependencies bump', async (t) => {
  const vol = Volume.fromJSON({
    [`${rootDir}/fakes/a/package.json`]: ''
  })
  const fs = createFsFromVolume(vol)
  const yarnSpy = createSpy(() => Promise.resolve())

  mock('../src/write-package-dependencies', {
    './yarn-install': {
      yarnInstall: yarnSpy
    },
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

  const { writePackageDependencies } = await import('../src/write-package-dependencies')

  await writePackageDependencies({
    name: 'a',
    dir: `${rootDir}/fakes/a`,
    version: '1.0.1',
    type: null,
    deps: null,
    devDeps: {
      'b': '0.0.2',
      'c': '0.0.3'
    }
  }, options)

  const packageData = fs.readFileSync(`${rootDir}/fakes/a/package.json`, 'utf8') as string
  const packageJson = JSON.parse(packageData)

  t.deepEquals(
    packageJson,
    {
      name: '@ns/a',
      version: '1.0.0',
      devDependencies: {
        '@ns/b': '0.0.2',
        '@ns/c': '0.0.3'
      }
    },
    'should write bumps, and ignore version'
  )

  t.deepEquals(
    getSpyCalls(yarnSpy),
    [
      []
    ],
    'should call yarn install'
  )

  unmock('../src/write-package-dependencies')
})
