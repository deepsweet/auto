import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { options } from '../../utils/test/git-options'

test('git:makeWorkspacesCommit', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '@ns/foo' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy }
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    '@ns/foo': {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3'
      }
    }
  }, options)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix foo: message']]
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: no auto name prefix in options', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '@ns/foo' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy }
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    '@ns/foo': {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3'
      }
    }
  }, {
    ...options,
    autoNamePrefix: ''
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix @ns/foo: message']]
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: no package name (`-`)', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '-' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy }
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  await makeWorkspacesCommit({
    '@ns/foo': {
      dir: 'fakes/foo',
      json: {
        name: '@ns/foo',
        version: '1.2.3'
      }
    }
  }, options)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix message']]
    ],
    'should write proper message'
  )

  unmock('../src/make-workspaces-commit')
})

test('git:makeWorkspacesCommit: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    if (index === 1) {
      return Promise.resolve({ packageName: '@ns/foo' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-workspaces-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy }
  })

  const { makeWorkspacesCommit } = await import('../src/make-workspaces-commit')

  try {
    await makeWorkspacesCommit({
      '@ns/foo': {
        dir: 'fakes/foo',
        json: {
          name: '@ns/foo',
          version: '1.2.3'
        }
      }
    }, options)

    t.fail('should not get here')
  } catch (err) {
    t.equals(err, null, 'error should be null')
  }

  unmock('../src/make-workspaces-commit')
})
