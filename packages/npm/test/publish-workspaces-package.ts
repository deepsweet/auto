/* eslint-disable prefer-promise-reject-errors */
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { createFsFromVolume, Volume } from 'memfs'

const rootDir = process.cwd()
const vol = Volume.fromJSON({
  [`${rootDir}/fake/package.json`]: ''
})
const fs = createFsFromVolume(vol)

test('npm:publishWorkspacesPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-workspaces-package', {
    execa: { default: execaSpy }
  })

  const { publishWorkspacesPackage } = await import('../src/publish-workspaces-package')

  await publishWorkspacesPackage({
    name: 'baz',
    dir: '/foo/bar/baz',
    version: '1.2.3',
    type: 'minor',
    deps: null,
    devDeps: null
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-workspaces-package')
})

test('npm:publishWorkspacesPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-workspaces-package', {
    execa: { default: execaSpy }
  })

  const { publishWorkspacesPackage } = await import('../src/publish-workspaces-package')

  await publishWorkspacesPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null
    },
    {
      registry: 'https://custom-registry'
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://custom-registry', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-workspaces-package')
})

test('npm:publishWorkspacesPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-workspaces-package', {
    execa: { default: execaSpy },
    [`${rootDir}/package.json`]: {
      default: {
        publishConfig: {
          registry: 'https://my-registry'
        }
      }
    }
  })

  const { publishWorkspacesPackage } = await import('../src/publish-workspaces-package')

  await publishWorkspacesPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://my-registry', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-workspaces-package')
})

test('npm:publishWorkspacesPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-workspaces-package', {
    execa: { default: execaSpy },
    [`${rootDir}/package.json`]: {
      default: {
        publishConfig: {
          registry: 'https://my-registry'
        }
      }
    }
  })

  const { publishWorkspacesPackage } = await import('../src/publish-workspaces-package')

  await publishWorkspacesPackage(
    {
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null
    },
    {
      registry: 'https://options-registry'
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '--registry', 'https://options-registry', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-workspaces-package')
})
