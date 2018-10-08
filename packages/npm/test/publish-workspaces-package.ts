import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'

test('npm:publishWorkspacesPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-workspaces-package', {
    execa: { default: execaSpy },
    '@auto/fs/src': {
      getRepoPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3'
      })
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
      ['npm', ['publish', '--registry', 'https://registry.npmjs.org/', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-workspaces-package')
})

test('npm:publishWorkspacesPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-workspaces-package', {
    execa: { default: execaSpy },
    '@auto/fs/src': {
      getRepoPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3'
      })
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
    '@auto/fs/src': {
      getRepoPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry'
        }
      })
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
    '@auto/fs/src': {
      getRepoPackage: () => Promise.resolve({
        name: 'baz',
        version: '1.2.3',
        publishConfig: {
          registry: 'https://my-registry'
        }
      })
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
