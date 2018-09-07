import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { TGitWorkspacesBump, TPackages } from '@auto/utils/src/'
import { options } from '../../utils/test/git-options'

const packages: TPackages = {
  '@ns/foo': {
    dir: 'fakes/foo',
    json: {
      name: '@ns/foo',
      version: '0.1.2'
    }
  },
  '@ns/bar': {
    dir: 'fakes/bar',
    json: {
      name: '@ns/bar',
      version: '2.1.0'
    }
  }
}

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.patch.value} foo: patch 2`,
        `${options.semverPrefixes.patch.value} foo: patch 1`,
        `${options.autoPrefixes.publish.value} foo: v1.2.3`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch 2'
      }, {
        type: 'patch',
        value: 'patch 1'
      }]
    }] as TGitWorkspacesBump[],
    'bump as patch + patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} foo: minor`,
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.autoPrefixes.publish.value} foo: v1.2.3`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [{
        type: 'minor',
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }]
    }] as TGitWorkspacesBump[],
    'bump as patch + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.semverPrefixes.minor.value} foo: minor`,
        `${options.autoPrefixes.publish.value} foo: v1.2.3`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [{
        type: 'patch',
        value: 'patch'
      }, {
        type: 'minor',
        value: 'minor'
      }]
    }] as TGitWorkspacesBump[],
    'bump as minor + patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.major.value} foo: major`,
        `${options.semverPrefixes.minor.value} foo: minor`,
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.autoPrefixes.publish.value} foo: v1.2.3`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
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
    }] as TGitWorkspacesBump[],
    'bump as patch + minor + major'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} foo: minor`,
        `${options.semverPrefixes.major.value} foo: major`,
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.autoPrefixes.publish.value} foo: v1.2.3`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
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
    }] as TGitWorkspacesBump[],
    'bump as patch + major + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} foo: minor`,
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.semverPrefixes.major.value} foo: major`,
        `${options.autoPrefixes.publish.value} foo: v1.2.3`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
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
    }] as TGitWorkspacesBump[],
    'bump as major + patch + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps multiple packages', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.autoPrefixes.publish.value} foo: v1.0.1`,
        `${options.semverPrefixes.major.value} foo: breaking`,
        `${options.semverPrefixes.patch.value} bar: patch`,
        `${options.autoPrefixes.publish.value} bar: v2.0.1`,
        `${options.semverPrefixes.major.value} bar: breaking`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch'
      }]
    }, {
      name: '@ns/bar',
      type: 'patch',
      messages: [{
        type: 'patch',
        value: 'patch'
      }]
    }] as TGitWorkspacesBump[],
    'bump as patch && patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps all packages', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} *: minor`,
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.semverPrefixes.patch.value} bar: patch`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor'
        },
        {
          type: 'patch',
          value: 'patch'
        }
      ]
    }, {
      name: '@ns/bar',
      type: 'minor',
      messages: [
        {
          type: 'minor',
          value: 'minor'
        },
        {
          type: 'patch',
          value: 'patch'
        }
      ]
    }] as TGitWorkspacesBump[],
    'bump as minor && minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps skipped commits', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.semverPrefixes.minor.value} foo: minor`,
        `${options.semverPrefixes.minor.value} foo`,
        `${options.semverPrefixes.major.value}`,
        'beep',
        `${options.autoPrefixes.dependencies.value} foo: upgrade dependencies`,
        `${options.semverPrefixes.patch.value} foo: patch`,
        `${options.semverPrefixes.patch.value} baz: patch`,
        `${options.autoPrefixes.publish.value} foo: v1.0.1`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(packages, options),
    [{
      name: '@ns/foo',
      type: 'minor',
      messages: [{
        type: 'minor',
        value: 'minor'
      }, {
        type: 'patch',
        value: 'patch'
      }]
    }] as TGitWorkspacesBump[],
    'skip invalid commit messages'
  )

  unmock('../src/get-workspaces-bumps')
})
