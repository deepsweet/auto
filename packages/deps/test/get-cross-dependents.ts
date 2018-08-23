import test from 'blue-tape'
import getCrossDependents from '../src/get-cross-dependents'

test('deps:getCrossDependents no cross dependencies', async (t) => {
  const packages = {
    a: {
      path: '/fakes/a/package.json',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: {},
        devDependencies: {}
      }
    },
    b: {
      path: '/fakes/b/package.json',
      json: {
        name: 'b',
        version: '0.2.0',
        dependencies: {},
        devDependencies: {}
      }
    },
    c: {
      path: '/fakes/c/package.json',
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

test('deps:getCrossDependents one cross dependency', async (t) => {
  const packages = {
    a: {
      path: '/fakes/a/package.json',
      json: {
        name: 'a',
        version: '0.1.0',
        devDependencies: {}
      }
    },
    b: {
      path: '/fakes/b/package.json',
      json: {
        name: 'b',
        version: '0.2.0',
        dependencies: { a: '^0.1.0' }
      }
    },
    c: {
      path: '/fakes/c/package.json',
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

test('deps:getCrossDependents multiple cross dependencies', async (t) => {
  const packages = {
    a: {
      path: '/fakes/a/package.json',
      json: {
        name: 'a',
        version: '0.1.0',
        dependencies: {},
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

test('deps:getCrossDependents circular dependencies', async (t) => {
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
    await getCrossDependents(packages),
    {
      'a': [{ name: 'b', range: '^0.1.0', devRange: null }],
      'b': [{ name: 'c', range: '^0.2.0', devRange: null }],
      'c': [{ name: 'a', range: '^0.3.0', devRange: null }]
    },
    'circular cross dependencies'
  )
})
