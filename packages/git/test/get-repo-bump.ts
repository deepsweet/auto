import test from 'blue-tape'
import { options } from '../../utils/test/options'
import { mock, unmock } from 'mocku'
import { TRepoGitBump } from '@auto/utils/src/'

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.patch.value} patch 2`,
        `${options.requiredPrefixes.patch.value} patch 1`,
        `${options.requiredPrefixes.publish.value} v1.2.3`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'patch 2'
      }, {
        type: 'patch',
        value: 'patch 1'
      }]
    } as TRepoGitBump,
    'bump as patch + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.publish.value} v1.2.3`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }]
    } as TRepoGitBump,
    'bump as patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.publish.value} v1.2.3`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'patch'
      }, {
        type: 'minor',
        value: 'minor'

      }]
    } as TRepoGitBump,
    'bump as minor + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.major.value} major`,
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.publish.value} v1.2.3`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'major'
      }, {
        type: 'minor',
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }]
    } as TRepoGitBump,
    'bump as patch + minor + major'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.major.value} major`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.publish.value} v1.2.3`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'minor'

      }, {
        type: 'major',
        value: 'major'
      }, {
        type: 'patch',
        value: 'patch'
      }]
    } as TRepoGitBump,
    'bump as patch + major + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.major.value} major`,
        `${options.requiredPrefixes.publish.value} v1.2.3`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }, {
        type: 'major',
        value: 'major'
      }]
    } as TRepoGitBump,
    'bump as major + patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump skipped commits', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} minor`,
        '💥',
        'beep',
        `${options.requiredPrefixes.dependencies.value} upgrade dependencies`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.publish.value} v1.0.1`,
        `${options.requiredPrefixes.initial.value} initial`
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
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }]
    } as TRepoGitBump,
    'skip invalid commit messages'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package initial only', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.initial.value} initial`
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
      type: options.initialType,
      messages: [{
        type: 'initial',
        value: 'initial'
      }]
    } as TRepoGitBump,
    'bump as initial'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package initial', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.major.value} major`,
        `${options.requiredPrefixes.initial.value} initial`
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
      type: options.initialType,
      messages: [{
        type: 'minor',
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }, {
        type: 'major',
        value: 'major'
      }, {
        type: 'initial',
        value: 'initial'
      }]
    } as TRepoGitBump,
    'bump as major + patch + minor + initial'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package multiple initial', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} minor`,
        `${options.requiredPrefixes.patch.value} patch`,
        `${options.requiredPrefixes.initial.value} initial`,
        `${options.requiredPrefixes.major.value} major`,
        `${options.requiredPrefixes.initial.value} initial`
      ])
    }
  })

  const { getRepoBump } = await import('../src/get-repo-bump')

  t.deepEquals(
    await getRepoBump(options),
    {
      type: options.initialType,
      messages: [{
        type: 'minor',
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }, {
        type: 'initial',
        value: 'initial'
      }]
    } as TRepoGitBump,
    'bump as minor + patch + initial'
  )

  unmock('../src/get-repo-bump')
})
