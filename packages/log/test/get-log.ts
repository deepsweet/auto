import test from 'blue-tape'
import { getLog } from '../src/get-log'
import { options } from '../../utils/test/git-options'

test('getLog', (t) => {
  t.deepEquals(
    getLog(
      [
        {
          name: '@ns/a',
          dir: 'fakes/a',
          version: null,
          type: null,
          deps: null,
          devDeps: {
            '@ns/b': '1.2.3'
          }
        }
      ],
      [
        {
          name: '@ns/b',
          type: 'patch',
          messages: []
        }
      ],
      options
    ),
    [],
    'devDeps: should return empty array'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: '@ns/a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: {
            '@ns/b': '1.2.3',
            '@ns/c': '1.2.3'
          },
          devDeps: null
        }
      ],
      [
        {
          name: '@ns/b',
          type: 'patch',
          messages: []
        }
      ],
      options
    ),
    [
      {
        name: '@ns/a',
        version: '1.2.3',
        type: 'patch',
        messages: [
          {
            type: 'patch',
            prefix: options.prefixes.patch[0],
            value: 'upgrade dependencies: @ns/b, @ns/c'
          }
        ]
      }
    ],
    'deps only: should return dependency upgrade message'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: '@ns/a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: null,
          devDeps: null
        }
      ],
      [],
      options
    ),
    [],
    'skip incorrect case in results'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: '@ns/a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: {
            '@ns/b': '1.2.3',
            '@ns/c': '1.2.3'
          },
          devDeps: null
        }
      ],
      [
        {
          name: '@ns/a',
          type: 'patch',
          messages: [
            {
              type: 'minor',
              prefix: options.prefixes.minor[0],
              value: 'minor'
            },
            {
              type: 'patch',
              prefix: options.prefixes.patch[0],
              value: 'patch'
            },
            {
              type: 'major',
              prefix: options.prefixes.major[0],
              value: 'major'
            }
          ]
        }
      ],
      options
    ),
    [
      {
        name: '@ns/a',
        version: '1.2.3',
        type: 'patch',
        messages: [
          {
            type: 'major',
            prefix: options.prefixes.major[0],
            value: 'major'
          },
          {
            type: 'minor',
            prefix: options.prefixes.minor[0],
            value: 'minor'
          },
          {
            type: 'patch',
            prefix: options.prefixes.patch[0],
            value: 'patch'
          },
          {
            type: 'patch',
            prefix: options.prefixes.patch[0],
            value: 'upgrade dependencies: @ns/b, @ns/c'
          }
        ]
      }
    ],
    'deps with messages: should return sorted messages with dependency upgrade message'
  )

  t.deepEquals(
    getLog(
      [
        {
          name: '@ns/a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'patch',
          deps: null,
          devDeps: null
        }
      ],
      [
        {
          name: '@ns/a',
          type: 'patch',
          messages: [
            {
              type: 'minor',
              prefix: options.prefixes.minor[0],
              value: 'minor'
            },
            {
              type: 'patch',
              prefix: options.prefixes.patch[0],
              value: 'patch'
            },
            {
              type: 'major',
              prefix: options.prefixes.major[0],
              value: 'major'
            }
          ]
        }
      ],
      options
    ),
    [
      {
        name: '@ns/a',
        version: '1.2.3',
        type: 'patch',
        messages: [
          {
            type: 'major',
            prefix: options.prefixes.major[0],
            value: 'major'
          },
          {
            type: 'minor',
            prefix: options.prefixes.minor[0],
            value: 'minor'
          },
          {
            type: 'patch',
            prefix: options.prefixes.patch[0],
            value: 'patch'
          }
        ]
      }
    ],
    'messages only: should return sorted messages'
  )

  t.end()
})
