import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { options } from '../../utils/test/options'

test('git:writeWorkspacesPublishCommit: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-publish-commit', {
    execa: { default: execaSpy }
  })

  const { writeWorkspacesPublishCommit } = await import('../src/write-workspaces-publish-commit')

  await writeWorkspacesPublishCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: 'patch',
      version: '0.1.1',
      deps: null,
      devDeps: null
    },
    options
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      [
        'git',
        [
          'commit',
          '-m',
          `${options.requiredPrefixes.publish.value} a: v0.1.1`,
          'fakes/a/package.json'
        ]
      ]
    ],
    'single package'
  )

  unmock('../src/write-workspaces-publish-commit')
})

test('git:writeWorkspacesPublishCommit: no packages to publish', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-publish-commit', {
    execa: { default: execaSpy }
  })

  const { writeWorkspacesPublishCommit } = await import('../src/write-workspaces-publish-commit')

  await writeWorkspacesPublishCommit(
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
    options
  )

  t.deepEquals(
    getSpyCalls(execaSpy),
    [],
    'no packages to publish'
  )

  unmock('../src/write-workspaces-publish-commit')
})
