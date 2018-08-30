import test from 'blue-tape'
import { getDependentsOf } from '../src/get-dependents-of'

test('workspaces:getDependentsOf circular cross dependencies', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: { c: '^0.3.0' },
        devDependencies: {}
      }
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: 'b',
        version: '0.2.0',
        dependencies: { a: '^0.1.0' },
        devDependencies: {}
      }
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: 'c',
        version: '0.3.0',
        dependencies: { b: '^0.2.0' },
        devDependencies: {}
      }
    }
  }

  t.deepEquals(
    await getDependentsOf(packages, 'a'),
    [{ name: 'b', range: '^0.1.0', devRange: null }],
    'circular cross dependencies'
  )
})

test('workspaces:getDependentsOf no dependents', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0'
      }
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: 'b',
        version: '0.2.0'
      }
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: 'c',
        version: '0.3.0'
      }
    }
  }

  t.deepEquals(
    await getDependentsOf(packages, 'a'),
    null,
    'no dependents'
  )
})
