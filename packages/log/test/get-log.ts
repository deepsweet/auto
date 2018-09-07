import test from 'blue-tape'
import { getLog } from '../src/get-log'
import { options } from '../../utils/test/git-options'
import { TWorkspacesLog } from '@auto/utils/src/'

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
            value: 'upgrade dependencies: b, c'
          }
        ]
      }
    ] as TWorkspacesLog[],
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
      [] as TWorkspacesLog[],
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
              value: 'minor'
            },
            {
              type: 'patch',
              value: 'patch'
            },
            {
              type: 'major',
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
            value: 'major'
          },
          {
            type: 'minor',
            value: 'minor'
          },
          {
            type: 'patch',
            value: 'patch'
          },
          {
            type: 'patch',
            value: 'upgrade dependencies: b, c'
          }
        ]
      }
    ] as TWorkspacesLog[],
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
              value: 'minor'
            },
            {
              type: 'patch',
              value: 'patch'
            },
            {
              type: 'major',
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
            value: 'major'
          },
          {
            type: 'minor',
            value: 'minor'
          },
          {
            type: 'patch',
            value: 'patch'
          }
        ]
      }
    ] as TWorkspacesLog[],
    'messages only: should return sorted messages'
  )

  t.end()
})
