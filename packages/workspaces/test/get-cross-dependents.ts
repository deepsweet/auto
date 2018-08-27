import test from 'blue-tape'
import { getCrossDependents } from '../src/get-cross-dependents'

test('workspace:getCrossDependents no cross dependencies', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: {},
        devDependencies: {}
      }
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: 'b',
        version: '0.2.0',
        dependencies: {},
        devDependencies: {}
      }
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: 'c',
        version: '0.3.0',
        dependencies: {},
        devDependencies: {}
      }
    }
  }

  t.deepEquals(
    await getCrossDependents(packages),
    {},
    'empty object when there is no cross dependencies'
  )
})

test('workspace:getCrossDependents one cross dependency', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0',
        devDependencies: {}
      }
    },
    b: {
      dir: '/fakes/b',
      json: {
        name: 'b',
        version: '0.2.0',
        dependencies: { a: '^0.1.0' }
      }
    },
    c: {
      dir: '/fakes/c',
      json: {
        name: 'c',
        version: '0.3.0',
        dependencies: {},
        devDependencies: {}
      }
    }
  }

  t.deepEquals(
    await getCrossDependents(packages),
    {
      'a': [{ name: 'b', range: '^0.1.0', devRange: null }]
    },
    'single cross dependency'
  )
})

test('workspace:getCrossDependents multiple cross dependencies', async (t) => {
  const packages = {
    a: {
      dir: '/fakes/a',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: {},
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
        dependencies: {},
        devDependencies: { a: '^0.3.0' }
      }
    }
  }

  t.deepEquals(
    await getCrossDependents(packages),
    {
      'a': [
        { name: 'b', range: '^0.1.0', devRange: null },
        { name: 'c', range: null, devRange: '^0.3.0' }
      ]
    },
    'multiple cross dependencies'
  )
})

test('workspace:getCrossDependents circular dependencies', async (t) => {
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
    await getCrossDependents(packages),
    {
      'a': [{ name: 'b', range: '^0.1.0', devRange: null }],
      'b': [{ name: 'c', range: '^0.2.0', devRange: null }],
      'c': [{ name: 'a', range: '^0.3.0', devRange: null }]
    },
    'circular cross dependencies'
  )
})
