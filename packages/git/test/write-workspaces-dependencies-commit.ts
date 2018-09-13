import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { options } from '../../utils/test/options'

test('git:writeWorkspacesDependenciesCommit: no dependencies', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy }
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
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
    getSpyCalls(execaSpy),
    [],
    'empty array'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})

test('git:writeWorkspacesDependenciesCommit: single dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy }
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: 'patch',
      version: null,
      deps: {
        '@ns/b': '~0.2.0'
      },
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
          `${options.requiredPrefixes.dependencies.value} a: upgrade dependencies`,
          'fakes/a/package.json'
        ]
      ]
    ],
    'single commit'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})

test('git:writeWorkspacesDependenciesCommit: single dev dependency', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-workspaces-dependencies-commit', {
    execa: { default: execaSpy }
  })

  const { writeWorkspacesDependenciesCommit } = await import('../src/write-workspaces-dependencies-commit')

  await writeWorkspacesDependenciesCommit(
    {
      name: '@ns/a',
      dir: 'fakes/a',
      type: null,
      version: null,
      deps: null,
      devDeps: {
        '@ns/b': '~0.2.0'
      }
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
          `${options.requiredPrefixes.dependencies.value} a: upgrade dependencies`,
          'fakes/a/package.json'
        ]
      ]
    ],
    'single commit'
  )

  unmock('../src/write-workspaces-dependencies-commit')
})
