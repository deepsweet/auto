import test from 'blue-tape'
import { getDependentsOf } from '../src/get-dependents-of'

test('workspace:getDependentsOf circular cross dependencies', async (t) => {
  const packages = {
    a: {
      path: '/fakes/a/package.json',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: { c: '^0.3.0' },
        devDependencies: {}
      }
    },
    b: {
      path: '/fakes/b/package.json',
      json: {
        name: 'b',
        version: '0.2.0',
        dependencies: { a: '^0.1.0' },
        devDependencies: {}
      }
    },
    c: {
      path: '/fakes/c/package.json',
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

test('workspace:getDependentsOf no dependents', async (t) => {
  const packages = {
    a: {
      path: '/fakes/a/package.json',
      json: {
        name: 'a',
        version: '0.1.0'
      }
    },
    b: {
      path: '/fakes/b/package.json',
      json: {
        name: 'b',
        version: '0.2.0'
      }
    },
    c: {
      path: '/fakes/c/package.json',
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
