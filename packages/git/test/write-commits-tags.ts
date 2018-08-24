import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { gitOptions } from './git-options'

test('git:writeCommitsTags: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-commits-tags', {
    execa: { default: execaSpy }
  })

  const { writeCommitsTags } = await import('../src/write-commits-tags')

  await writeCommitsTags({
    '@ns/a': {
      path: 'fakes/a/package.json',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null
    }
  }, gitOptions)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', '📦 a: v0.1.1', 'fakes/a/package.json']],
      ['git', ['tag', '-m', 'a@0.1.1', 'a@0.1.1']]
    ],
    'single package'
  )

  unmock('../src/write-commits-tags')
})

test('git:writeCommitsTags: multiple packages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-commits-tags', {
    execa: { default: execaSpy }
  })

  const { writeCommitsTags } = await import('../src/write-commits-tags')

  await writeCommitsTags({
    '@ns/a': {
      path: 'fakes/a/package.json',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null
    },
    '@ns/b': {
      path: 'fakes/b/package.json',
      type: null,
      version: null,
      deps: null,
      devDeps: {
        '@ns/a': '^0.1.0'
      }
    },
    '@ns/c': {
      path: 'fakes/c/package.json',
      type: 'patch',
      version: '1.2.0',
      deps: null,
      devDeps: {
        '@ns/b': '~1.2.3'
      }
    }
  }, gitOptions)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', '📦 c: v1.2.0', 'fakes/c/package.json']],
      ['git', ['tag', '-m', 'c@1.2.0', 'c@1.2.0']],
      ['git', ['commit', '-m', '📦 a: v0.1.1', 'fakes/a/package.json']],
      ['git', ['tag', '-m', 'a@0.1.1', 'a@0.1.1']]
    ],
    'multiple packages'
  )

  unmock('../src/write-commits-tags')
})

test('git:writeCommitsTags: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-commits-tags', {
    execa: { default: execaSpy }
  })

  const { writeCommitsTags } = await import('../src/write-commits-tags')

  await writeCommitsTags({
    '@ns/a': {
      path: 'fakes/a/package.json',
      type: null,
      version: null,
      deps: {
        '@ns/b': '~0.2.0'
      },
      devDeps: null
    },
    '@ns/b': {
      path: 'fakes/b/package.json',
      type: null,
      version: null,
      deps: {
        '@ns/a': '^1.2.0'
      },
      devDeps: null
    }
  }, gitOptions)

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'no packages to publish'
  )

  unmock('../src/write-commits-tags')
})

test('git:writeCommitsTags: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/write-commits-tags', {
    execa: { default: execaSpy }
  })

  const { writeCommitsTags } = await import('../src/write-commits-tags')

  try {
    await writeCommitsTags({
      '@ns/a': {
        path: 'fakes/a/package.json',
        type: 'major',
        version: '1.0.0',
        deps: {
          '@ns/b': '~0.2.0'
        },
        devDeps: null
      }
    }, gitOptions)

    t.fail('should not get here')
  } catch (err) {
    t.equal(err, null, 'error should be null')
  }

  unmock('../src/write-commits-tags')
})
