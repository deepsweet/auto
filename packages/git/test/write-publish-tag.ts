import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { gitOptions } from './git-options'

test('git:writePublishTag: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-tag', {
    execa: { default: execaSpy }
  })

  const { writePublishTag } = await import('../src/write-publish-tag')

  await writePublishTag(
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
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['tag', '-m', 'a@0.1.1', 'a@0.1.1']]
    ],
    'single package'
  )

  unmock('../src/write-publish-tag')
})

test('git:writePublishTag: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-publish-tag', {
    execa: { default: execaSpy }
  })

  const { writePublishTag } = await import('../src/write-publish-tag')

  await writePublishTag(
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
    getSpyCalls(execaSpy),
    [],
    'no packages to publish'
  )

  unmock('../src/write-publish-tag')
})

test('git:writePublishTag: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/write-publish-tag', {
    execa: { default: execaSpy }
  })

  const { writePublishTag } = await import('../src/write-publish-tag')

  try {
    await writePublishTag(
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

  unmock('../src/write-publish-tag')
})
