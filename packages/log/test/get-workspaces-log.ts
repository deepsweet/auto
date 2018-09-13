import test from 'blue-tape'
import { getWorkspacesLog } from '../src/get-workspaces-log'
import { options } from '../../utils/test/options'
import { TWorkspacesLog, TWorkspacesGitBump } from '@auto/utils/src/'

test('getWorkspacesLog', (t) => {
  t.deepEquals(
    getWorkspacesLog(
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
    getWorkspacesLog(
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
            type: 'dependencies',
            value: 'upgrade dependencies: b, c'
          }
        ]
      }
    ] as TWorkspacesLog[],
    'deps only: should return dependency upgrade message'
  )

  t.deepEquals(
    getWorkspacesLog(
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
      [] as TWorkspacesGitBump[],
      options
    ),
    [],
    'skip incorrect case in results'
  )

  t.deepEquals(
    getWorkspacesLog(
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
            type: 'dependencies',
            value: 'upgrade dependencies: b, c'
          }
        ]
      }
    ] as TWorkspacesLog[],
    'deps with messages: should return sorted messages with dependency upgrade message'
  )

  t.deepEquals(
    getWorkspacesLog(
      [
        {
          name: '@ns/a',
          dir: 'fakes/a',
          version: '1.2.3',
          type: 'major',
          deps: null,
          devDeps: null
        }
      ],
      [
        {
          name: '@ns/a',
          type: 'major',
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
        type: 'major',
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
