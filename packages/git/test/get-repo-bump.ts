import test from 'blue-tape'
import { options } from '../../utils/test/git-options'
import { mock, unmock } from 'mocku'
import { TGitRepoBump } from '@auto/utils/src/'

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.patch.value} patch 2`,
        `${options.semverPrefixes.patch.value} patch 1`,
        `${options.autoPrefixes.publish.value} v1.2.3`
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
    } as TGitRepoBump,
    'bump as patch + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} minor`,
        `${options.semverPrefixes.patch.value} patch`,
        `${options.autoPrefixes.publish.value} v1.2.3`
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
    } as TGitRepoBump,
    'bump as patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.patch.value} patch`,
        `${options.semverPrefixes.minor.value} minor`,
        `${options.autoPrefixes.publish.value} v1.2.3`
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
    } as TGitRepoBump,
    'bump as minor + patch'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.major.value} major`,
        `${options.semverPrefixes.minor.value} minor`,
        `${options.semverPrefixes.patch.value} patch`,
        `${options.autoPrefixes.publish.value} v1.2.3`
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
    } as TGitRepoBump,
    'bump as patch + minor + major'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} minor`,
        `${options.semverPrefixes.major.value} major`,
        `${options.semverPrefixes.patch.value} patch`,
        `${options.autoPrefixes.publish.value} v1.2.3`
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
    } as TGitRepoBump,
    'bump as patch + major + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump single package', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} minor`,
        `${options.semverPrefixes.patch.value} patch`,
        `${options.semverPrefixes.major.value} major`,
        `${options.autoPrefixes.publish.value} v1.2.3`
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
    } as TGitRepoBump,
    'bump as major + patch + minor'
  )

  unmock('../src/get-repo-bump')
})

test('git:getRepoBump skipped commits', async (t) => {
  mock('../src/get-repo-bump', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} minor`,
        '💥',
        'beep',
        `${options.autoPrefixes.dependencies.value} upgrade dependencies`,
        `${options.semverPrefixes.patch.value} patch`,
        `${options.autoPrefixes.publish.value} v1.0.1`
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
    } as TGitRepoBump,
    'skip invalid commit messages'
  )

  unmock('../src/get-repo-bump')
})
