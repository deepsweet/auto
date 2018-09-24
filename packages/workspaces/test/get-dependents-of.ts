import test from 'blue-tape'
import { getDependentsOf } from '../src/get-dependents-of'
import { TWorkspacesOptions } from '@auto/utils/src'

const options: TWorkspacesOptions = {
  autoNamePrefix: '@ns/'
}

test('workspaces:getDependentsOf circular cross dependencies', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0',
        dependencies: { '@ns/c': '^0.3.0' },
        devDependencies: {}
      }
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0',
        dependencies: { '@ns/a': '^0.1.0' },
        devDependencies: {}
      }
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0',
        dependencies: { '@ns/b': '^0.2.0' },
        devDependencies: {}
      }
    }
  }

  t.deepEquals(
    await getDependentsOf(packages, 'a', options),
    [{ name: 'b', range: '^0.1.0', devRange: null }],
    'circular cross dependencies'
  )
})

test('workspaces:getDependentsOf no dependents', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: '@ns/a',
        version: '0.1.0'
      }
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: '@ns/b',
        version: '0.2.0'
      }
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: '@ns/c',
        version: '0.3.0'
      }
    }
  }

  t.deepEquals(
    await getDependentsOf(packages, 'a', options),
    null,
    'no dependents'
  )
})
