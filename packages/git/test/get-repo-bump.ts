import test from 'blue-tape'
import { options } from '../../utils/test/git-options'
import { mock, unmock } from 'mocku'

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ patch 2',
        '✔️ patch 1',
        '📦 v1.2.3'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'bump as patch + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ minor',
        '✔️ patch',
        '📦 v1.2.3'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'bump as patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '✔️ patch',
        '➕ minor',
        '📦 v1.2.3'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'bump as minor + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '💥 major',
        '➕ minor',
        '✔️ patch',
        '📦 v1.2.3'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'bump as patch + minor + major'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ minor',
        '💥 major',
        '✔️ patch',
        '📦 v1.2.3'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'bump as patch + major + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ minor',
        '✔️ patch',
        '💥 major',
        '📦 v1.2.3'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'bump as major + patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump skipped commits', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        '➕ minor',
        '💥',
        'beep',
        '♻️ upgrade dependencies',
        '✔️ patch',
        '📦 v1.0.1'
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
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
    },
    'skip invalid commit messages'
  )

  unmock('../src/get-repo-bump')
})
