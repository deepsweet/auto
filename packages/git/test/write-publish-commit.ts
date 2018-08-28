import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { gitOptions } from './git-options'

test('git:writePublishCommit: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-commit', {
    execa: { default: execaSpy }
  })

  const { writePublishCommit } = await import('../src/write-publish-commit')

  await writePublishCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      messages: null,
      deps: null,
      devDeps: null
    },
    gitOptions
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', '📦 a: v0.1.1', 'fakes/a/package.json']]
    ],
    'single package'
  )

  unmock('../src/write-publish-commit')
})

test('git:writePublishCommit: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-commit', {
    execa: { default: execaSpy }
  })

  const { writePublishCommit } = await import('../src/write-publish-commit')

  await writePublishCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: null,
      version: null,
      messages: null,
      deps: {
        '@ns/b': '~0.2.0'
      },
      devDeps: null
    },
    gitOptions
  )

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'no packages to publish'
  )

  unmock('../src/write-publish-commit')
})

test('git:writePublishCommit: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/write-publish-commit', {
    execa: { default: execaSpy }
  })

  const { writePublishCommit } = await import('../src/write-publish-commit')

  try {
    await writePublishCommit(
      {
        name: '@ns/a',
        dir: 'fakes/a',
        type: 'major',
        version: '1.0.0',
        messages: null,
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

  unmock('../src/write-publish-commit')
})
