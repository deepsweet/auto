import test from 'blue-tape'
import gitOptions from './git-options'
import { mock, unmock } from 'mocku'

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch 2',
        '✔️ foo: patch 1',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'patch'
    }],
    'bump as patch + patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'minor'
    }],
    'bump as patch + minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch',
        '➕ foo: minor',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'minor'
    }],
    'bump as minor + patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '💥 foo: major',
        '➕ foo: minor',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'major'
    }],
    'bump as patch + minor + major'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '💥 foo: major',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'major'
    }],
    'bump as patch + major + minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps single package', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '✔️ foo: patch',
        '💥 foo: major',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'major'
    }],
    'bump as major + patch + minor'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps multiple packages', async (t) => {
  mock('../src/get-bumps', {
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

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'patch'
    }, {
      name: '@ns/bar',
      type: 'patch'
    }],
    'bump as patch && patch'
  )

  unmock('../src/get-bumps')
})

test('git:getBumps skipped commits', async (t) => {
  mock('../src/get-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: minor',
        '➕ foo',
        '💥',
        'beep',
        '✔️ foo: patch',
        '📦 foo: v1.0.1'
      ])
    }
  })

  const { default: getBumps } = await import('../src/get-bumps')

  t.deepEquals(
    await getBumps(gitOptions),
    [{
      name: '@ns/foo',
      type: 'patch'
    }],
    'skip invalid commit messages'
  )

  unmock('../src/get-bumps')
})
