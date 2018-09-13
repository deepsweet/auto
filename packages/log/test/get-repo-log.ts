import test from 'blue-tape'
import { getRepoLog } from '../src/get-repo-log'
import { TRepoLog } from '@auto/utils/src/'

test('getRepoLog', (t) => {
  t.deepEquals(
    getRepoLog(
      {
        version: '1.2.3',
        type: 'patch'
      },
      {
        type: 'patch',
        messages: [
          {
            type: 'patch',
            value: 'message'
          }
        ]
      }
    ),
    {
      version: '1.2.4',
      type: 'patch',
      messages: [
        {
          type: 'patch',
          value: 'message'
        }
      ]
    } as TRepoLog,
    'single git bump'
  )

  t.deepEquals(
    getRepoLog(
      {
        version: '1.2.3',
        type: 'major'
      },
      {
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
    ),
    {
      name: '@ns/a',
      version: '2.0.0',
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
    } as TRepoLog,
    'should return sorted messages'
  )

  t.end()
})