import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { TWorkspacesGitBump, TPackages } from '@auto/utils/src/'
import { options } from '../../utils/test/options'

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
        `${options.requiredPrefixes.patch.value} foo: patch 2`,
        `${options.requiredPrefixes.patch.value} foo: patch 1`,
        `${options.requiredPrefixes.publish.value} foo: v1.2.3`
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
    }] as TWorkspacesGitBump[],
    'bump as patch + patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} foo: minor`,
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.publish.value} foo: v1.2.3`
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
    }] as TWorkspacesGitBump[],
    'bump as patch + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.minor.value} foo: minor`,
        `${options.requiredPrefixes.publish.value} foo: v1.2.3`
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
    }] as TWorkspacesGitBump[],
    'bump as minor + patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.major.value} foo: major`,
        `${options.requiredPrefixes.minor.value} foo: minor`,
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.publish.value} foo: v1.2.3`
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
    }] as TWorkspacesGitBump[],
    'bump as patch + minor + major'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} foo: minor`,
        `${options.requiredPrefixes.major.value} foo: major`,
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.publish.value} foo: v1.2.3`
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
    }] as TWorkspacesGitBump[],
    'bump as patch + major + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps single package', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} foo: minor`,
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.major.value} foo: major`,
        `${options.requiredPrefixes.publish.value} foo: v1.2.3`
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
    }] as TWorkspacesGitBump[],
    'bump as major + patch + minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps multiple packages', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.publish.value} foo: v1.0.1`,
        `${options.requiredPrefixes.major.value} foo: breaking`,
        `${options.requiredPrefixes.patch.value} bar: patch`,
        `${options.requiredPrefixes.publish.value} bar: v2.0.1`,
        `${options.requiredPrefixes.major.value} bar: breaking`
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
    }] as TWorkspacesGitBump[],
    'bump as patch && patch'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps star symbol', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} *: minor`,
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.patch.value} bar: patch`
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
    }] as TWorkspacesGitBump[],
    'bump as minor && minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps string + star symbol', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} ns/*: minor`,
        `${options.requiredPrefixes.patch.value} ns/foo: patch`,
        `${options.requiredPrefixes.patch.value} ns/bar: patch`
      ])
    }
  })

  const { getWorkspacesBumps } = await import('../src/get-workspaces-bumps')

  t.deepEquals(
    await getWorkspacesBumps(
      packages,
      {
        ...options,
        autoNamePrefix: '@'
      }
    ),
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
    }] as TWorkspacesGitBump[],
    'bump as minor && minor'
  )

  unmock('../src/get-workspaces-bumps')
})

test('git:getWorkspacesBumps skipped commits', async (t) => {
  mock('../src/get-workspaces-bumps', {
    './get-commit-messages': {
      getCommitMessages: () => Promise.resolve([
        `${options.requiredPrefixes.minor.value} foo: minor`,
        `${options.requiredPrefixes.minor.value} foo`,
        `${options.requiredPrefixes.major.value}`,
        'beep',
        `${options.requiredPrefixes.dependencies.value} foo: upgrade dependencies`,
        `${options.requiredPrefixes.patch.value} foo: patch`,
        `${options.requiredPrefixes.patch.value} baz: patch`,
        `${options.requiredPrefixes.publish.value} foo: v1.0.1`
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
    }] as TWorkspacesGitBump[],
    'skip invalid commit messages'
  )

  unmock('../src/get-workspaces-bumps')
})
