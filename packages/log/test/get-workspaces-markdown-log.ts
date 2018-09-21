import test from 'blue-tape'
import { getWorkspacesMarkdownLog } from '../src/get-workspaces-markdown-log'
import { prefixes } from '@auto/utils/test/prefixes'

test('getWorkspacesMarkdownLog', (t) => {
  t.deepEquals(
    getWorkspacesMarkdownLog(
      [
        {
          name: 'a',
          version: '0.1.2',
          type: 'minor',
          messages: [
            {
              type: 'minor',
              value: 'minor'
            },
            {
              type: 'patch',
              value: 'patch'
            }
          ]
        },
        {
          name: 'b',
          version: '1.2.3',
          type: 'minor',
          messages: [
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
      ],
      prefixes
    ),
    '## a v0.1.2\n\n* 🌱 minor\n* 🐞 patch\n\n## b v1.2.3\n\n* 🌱 minor\n* 🐞 patch\n',
    'should get markdown'
  )

  t.end()
})
