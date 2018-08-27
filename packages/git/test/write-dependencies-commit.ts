import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { gitOptions } from './git-options'

test('git:writeDependenciesCommit: no dependencies', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy }
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  await writeDependenciesCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null
    },
    gitOptions
  )

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'empty array'
  )

  unmock('../src/write-dependencies-commit')
})

test('git:writeDependenciesCommit: single dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy }
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  await writeDependenciesCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: null,
      version: null,
      deps: {
        '@ns/b': '~0.2.0'
      },
      devDeps: null
    },
    gitOptions
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', '♻️ a: upgrade dependencies', 'fakes/a/package.json']]
    ],
    'single commit'
  )

  unmock('../src/write-dependencies-commit')
})

test('git:writeDependenciesCommit: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/write-dependencies-commit', {
    execa: { default: execaSpy }
  })

  const { writeDependenciesCommit } = await import('../src/write-dependencies-commit')

  try {
    await writeDependenciesCommit(
      {
        name: '@ns/a',
        dir: 'fakes/a',
        type: 'major',
        version: '1.0.0',
        deps: {
          '@ns/b': '~0.2.0'
        },
        devDeps: null
      },
      gitOptions
    )

    t.fail('should not get here')
  } catch (err) {
    t.equal(err, null, 'error should be null')
  }

  unmock('../src/write-dependencies-commit')
})
