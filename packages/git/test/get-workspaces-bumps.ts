import test from 'blue-tape'
import { options } from '../../utils/test/git-options'
import { mock, unmock } from 'mocku'

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch 2',
        '✔️ foo: patch 1',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'patch',
      messages: [{
        type: 'patch',
        prefix: '✔️',
        value: 'patch 2'
      }, {
        type: 'patch',
        prefix: '✔️',
        value: 'patch 1'
      }]
    }],
    'bump as patch + patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [{
        type: 'minor',
        prefix: '➕',
        value: 'minor'
      }, {
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }]
    }],
    'bump as patch + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch',
        '➕ foo: minor',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [{
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }, {
        type: 'minor',
        prefix: '➕',
        value: 'minor'

      }]
    }],
    'bump as minor + patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '💥 foo: major',
        '➕ foo: minor',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'major',
      messages: [{
        type: 'major',
        prefix: '💥',
        value: 'major'
      }, {
        type: 'minor',
        prefix: '➕',
        value: 'minor'
      }, {
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }]
    }],
    'bump as patch + minor + major'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '💥 foo: major',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'major',
      messages: [{
        type: 'minor',
        prefix: '➕',
        value: 'minor'

      }, {
        type: 'major',
        prefix: '💥',
        value: 'major'
      }, {
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }]
    }],
    'bump as patch + major + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '✔️ foo: patch',
        '💥 foo: major',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'major',
      messages: [{
        type: 'minor',
        prefix: '➕',
        value: 'minor'
      }, {
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }, {
        type: 'major',
        prefix: '💥',
        value: 'major'
      }]
    }],
    'bump as major + patch + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps multiple packages', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch',
        '📦 foo: v1.0.1',
        '✔️ bar: patch',
        '📦 bar: v2.0.1',
        '💥 foo: breaking',
        '💥 bar: breaking'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'patch',
      messages: [{
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }]
    }, {
      name: '@ns/bar',
      type: 'patch',
      messages: [{
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }]
    }],
    'bump as patch && patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps skipped commits', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '➕ foo',
        '💥',
        'beep',
        '♻️ foo: upgrade dependencies',
        '✔️ foo: patch',
        '📦 foo: v1.0.1'
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [{
        type: 'minor',
        prefix: '➕',
        value: 'minor'
      }, {
        type: 'patch',
        prefix: '✔️',
        value: 'patch'
      }]
    }],
    'skip invalid commit messages'
  )

  unmock('../src/get-workspaces-bumps')
})
