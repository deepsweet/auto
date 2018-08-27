import test from 'blue-tape'
import { getPackagesBumps } from '@auto/bump/src/get-packages-bumps'

test('getPackageBumps: single package', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0'
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      }
    ],
    'patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      }
    ],
    'minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.2.1'
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      }
    ],
    'major'
  )

  t.end()
})

test('getPackageBumps: multiple independent packages', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '0.2.1'
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '1.2.1'
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'b', type: 'minor' },
        { name: 'c', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '0.3.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      }
    ],
    'multiple'
  )

  t.end()
})

test('getPackageBumps: single package multiple bumps', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null
      }
    ],
    'patch + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      }
    ],
    'minor + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      }
    ],
    'patch + minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        }
      },
      [
        { name: 'a', type: 'major' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      }
    ],
    'major + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      }
    ],
    'patch + major'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        }
      },
      [
        { name: 'a', type: 'major' },
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      }
    ],
    'major + minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      }
    ],
    'minor + major'
  )

  t.end()
})

test('getPackageBumps: b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      }
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.3',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.3'
        },
        devDeps: null
      }
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0'
        },
        devDeps: null
      }
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '^0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0'
        },
        devDeps: null
      }
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.1.0'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '^1.0.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^1.2.0'
        },
        devDeps: null
      }
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.1.0'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '^1.0.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0'
        },
        devDeps: null
      }
    ],
    '^ major'
  )

  t.end()
})

test('getPackageBumps: b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      }
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.1'
        }
      }
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0'
        }
      }
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '^0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0'
        }
      }
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.1.0'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '^1.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.2.0'
        }
      }
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.1.0'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '^1.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0'
        }
      }
    ],
    '^ minor (major 1)'
  )

  t.end()
})

test('getPackageBumps: b -> a multiple bumps', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      }
    ],
    'patch + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: null
      }
    ],
    'minor + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: null
      }
    ],
    'patch + minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0'
        },
        devDeps: null
      }
    ],
    'major + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0'
        },
        devDeps: null
      }
    ],
    'patch + major'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' },
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0'
        },
        devDeps: null
      }
    ],
    'major + minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0'
        },
        devDeps: null
      }
    ],
    'minor + major'
  )

  t.end()
})

test('getPackageBumps: b |> a multiple bumps', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      }
    ],
    'patch + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0'
        }
      }
    ],
    'minor + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0'
        }
      }
    ],
    'patch + minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' },
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        devDeps: {
          a: '1.0.0'
        },
        deps: null
      }
    ],
    'major + patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '1.0.0'
        }
      }
    ],
    'patch + major'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' },
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '1.0.0'
        }
      }
    ],
    'major + minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.2'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.2'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '1.0.0'
        }
      }
    ],
    'minor + major'
  )

  t.end()
})

test('getPackageBumps: b -> a, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      }
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '~0.1.1'
        },
        devDeps: null
      }
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0'
        },
        devDeps: null
      }
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '^0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '^0.2.0'
        },
        devDeps: null
      }
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '2.3.4',
            dependencies: {
              a: '1.2.3'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '3.4.5',
            dependencies: {
              a: '^1.0.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '1.3.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '3.5.0',
        type: 'minor',
        deps: {
          a: '^1.3.0'
        },
        devDeps: null
      }
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '2.3.4',
            dependencies: {
              a: '1.2.3'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '3.4.5',
            dependencies: {
              a: '^1.0.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '3.0.0',
        type: 'major',
        deps: {
          a: '2.0.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '4.0.0',
        type: 'major',
        deps: {
          a: '^2.0.0'
        },
        devDeps: null
      }
    ],
    '^ major'
  )

  t.end()
})

test('getPackageBumps: b |> a, c |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              a: '0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      }
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.1'
        }
      }
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              a: '~0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0'
        }
      }
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              a: '^0.1.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.2.0'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0'
        }
      }
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '2.3.4',
            devDependencies: {
              a: '1.2.3'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '3.4.5',
            devDependencies: {
              a: '^1.0.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '1.3.0'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.3.0'
        }
      }
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.2.3'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '2.3.4',
            devDependencies: {
              a: '1.2.3'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '3.4.5',
            devDependencies: {
              a: '^1.0.0'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '2.0.0'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^2.0.0'
        }
      }
    ],
    '^ major'
  )

  t.end()
})

test('getPackageBumps: c -> b -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4'
        },
        devDeps: null
      }
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '~0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '~0.1.2'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4'
        },
        devDeps: null
      }
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '~0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0'
        },
        devDeps: null
      }
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '^0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^0.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0'
        },
        devDeps: null
      }
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '^1.0.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '^1.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0'
        },
        devDeps: null
      }
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '^0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '^1.0.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '2.0.0'
        },
        devDeps: null
      }
    ],
    '^ major'
  )

  t.end()
})

test('getPackageBumps: C |> b |> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      }
    ],
    'exact version patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '~0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.2',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '~0.1.2'
        }
      }
    ],
    '~ patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '~0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0'
        }
      }
    ],
    '~ minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '^0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^0.2.0'
        }
      }
    ],
    '^ minor (major 0)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '1.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '^1.0.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.2.0'
        }
      }
    ],
    '^ minor (major 1)'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.1'
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '^0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '^1.0.0'
        }
      }
    ],
    '^ major'
  )

  t.end()
})

test('getPackageBumps: c -> b -> a -> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            dependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: {
          c: '2.3.5'
        },
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.3.5',
        type: 'patch',
        deps: {
          b: '1.2.4'
        },
        devDeps: null
      }
    ],
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            dependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'b', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: {
          c: '2.4.0'
        },
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0'
        },
        devDeps: null
      }
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            dependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'b', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: {
          c: '2.4.0'
        },
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          b: '1.3.0'
        },
        devDeps: null
      }
    ],
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            dependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            dependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'b', type: 'major' },
        { name: 'c', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '1.0.0',
        type: 'major',
        deps: {
          c: '3.0.0'
        },
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: {
          a: '1.0.0'
        },
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '3.0.0',
        type: 'major',
        deps: {
          b: '2.0.0'
        },
        devDeps: null
      }
    ],
    'a patch + b major + c minor'
  )

  t.end()
})

test('getPackageBumps: c |> b |> a |> c', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            devDependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      }
    ],
    'a patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            devDependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'b', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.3.0'
        }
      }
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            devDependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'b', type: 'patch' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.2.4',
        type: 'patch',
        deps: null,
        devDeps: {
          a: '0.2.0'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: null,
        type: null,
        deps: null,
        devDeps: {
          b: '1.2.4'
        }
      }
    ],
    'a minor + b patch'
  )

  t.deepEquals(
    getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0',
            devDependencies: {
              c: '2.3.4'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3',
            devDependencies: {
              a: '0.1.0'
            }
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'b', type: 'major' },
        { name: 'c', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: {
          c: '2.4.0'
        }
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: {
          a: '0.1.1'
        }
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: null,
        devDeps: {
          b: '2.0.0'
        }
      }
    ],
    'a patch + b major + c minor'
  )

  t.end()
})

test('getPackageBumps: c |> b, c -> a', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3'
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '0.1.0'
            },
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'patch' },
        { name: 'b', type: 'minor' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.1.1',
        type: 'patch',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '1.3.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.3.5',
        type: 'patch',
        deps: {
          a: '0.1.1'
        },
        devDeps: {
          b: '1.3.0'
        }
      }
    ],
    'a patch + b minor'
  )

  t.deepEquals(
    getPackagesBumps(
      {
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
            version: '1.2.3'
          }
        },
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '0.1.0'
            },
            devDependencies: {
              b: '1.2.3'
            }
          }
        }
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'b', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: {
          b: '2.0.0'
        }
      }
    ],
    'a minor + b major'
  )

  t.end()
})

test('getPackageBumps: throw', (t) => {
  t.throws(
    () => getPackagesBumps(
      {
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0'
          }
        }
      },
      [
        { name: 'b', type: 'minor' }
      ]
    ),
    /Unable to find package/,
    'not existing package'
  )

  t.end()
})

test('getPackageBumps: sort', (t) => {
  t.deepEquals(
    getPackagesBumps(
      {
        c: {
          path: '/fakes/c/package.json',
          json: {
            name: 'c',
            version: '2.3.4',
            dependencies: {
              a: '0.1.0'
            },
            devDependencies: {
              b: '1.2.3'
            }
          }
        },
        b: {
          path: '/fakes/b/package.json',
          json: {
            name: 'b',
            version: '1.2.3'
          }
        },
        a: {
          path: '/fakes/a/package.json',
          json: {
            name: 'a',
            version: '0.1.0'
          }
        },
      },
      [
        { name: 'a', type: 'minor' },
        { name: 'b', type: 'major' }
      ]
    ),
    [
      {
        name: 'a',
        path: '/fakes/a/package.json',
        version: '0.2.0',
        type: 'minor',
        deps: null,
        devDeps: null
      },
      {
        name: 'b',
        path: '/fakes/b/package.json',
        version: '2.0.0',
        type: 'major',
        deps: null,
        devDeps: null
      },
      {
        name: 'c',
        path: '/fakes/c/package.json',
        version: '2.4.0',
        type: 'minor',
        deps: {
          a: '0.2.0'
        },
        devDeps: {
          b: '2.0.0'
        }
      }
    ],
    'should sort'
  )

  t.end()
})