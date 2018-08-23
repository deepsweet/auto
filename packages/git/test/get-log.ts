import test from 'blue-tape'
import gitOptions from './git-options'
import { mock, unmock } from 'mocku'

test('git:getLog single package', async (t) => {
  mock('../src/get-log', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch 2',
        '✔️ foo: patch 1',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '✔️ patch 2',
        '✔️ patch 1'
      ]
    }],
    'bump as patch + patch'
  )

  unmock('../src/get-log')
})

test('git:getLog single package', async (t) => {
  mock('../src/get-log', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '➕ minor',
        '✔️ patch'
      ]
    }],
    'bump as patch + minor'
  )

  unmock('../src/get-log')
})

test('git:getLog single package', async (t) => {
  mock('../src/get-log', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ foo: patch',
        '➕ foo: minor',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '✔️ patch',
        '➕ minor'
      ]
    }],
    'bump as minor + patch'
  )

  unmock('../src/get-log')
})

test('git:getLog single package', async (t) => {
  mock('../src/get-log', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '💥 foo: major',
        '➕ foo: minor',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '💥 major',
        '➕ minor',
        '✔️ patch'
      ]
    }],
    'bump as patch + minor + major'
  )

  unmock('../src/get-log')
})

test('git:getLog single package', async (t) => {
  mock('../src/get-log', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '💥 foo: major',
        '✔️ foo: patch',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '➕ minor',
        '💥 major',
        '✔️ patch'
      ]
    }],
    'bump as patch + major + minor'
  )

  unmock('../src/get-log')
})

test('git:getLog single package', async (t) => {
  mock('../src/get-log', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ foo: minor',
        '✔️ foo: patch',
        '💥 foo: major',
        '📦 foo: v1.2.3'
      ])
    }
  })

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '➕ minor',
        '✔️ patch',
        '💥 major'
      ]
    }],
    'bump as major + patch + minor'
  )

  unmock('../src/get-log')
})

test('git:getLog multiple packages', async (t) => {
  mock('../src/get-log', {
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

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: ['✔️ patch']
    }, {
      name: '@ns/bar',
      messages: ['✔️ patch']
    }],
    'bump as patch && patch'
  )

  unmock('../src/get-log')
})

test('git:getLog skipped commits', async (t) => {
  mock('../src/get-log', {
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

  const { default: getLog } = await import('../src/get-log')

  t.deepEquals(
    await getLog(gitOptions),
    [{
      name: '@ns/foo',
      messages: [
        '✔️ minor',
        '✔️ patch'
      ]
    }],
    'skip invalid commit messages'
  )

  unmock('../src/get-log')
})
