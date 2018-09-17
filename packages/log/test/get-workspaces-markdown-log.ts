import test from 'blue-tape'
import { getWorkspacesMarkdownLog } from '../src/get-workspaces-markdown-log'
import { options } from '@auto/utils/test/options'

test('getWorkspacesMarkdownLog', (t) => {
  t.deepEquals(
    getWorkspacesMarkdownLog(
      [
        {
          name: '@ns/a',
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
          name: '@ns/b',
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
      options
    ),
    '## @ns/a v0.1.2\n\n* 🌱 minor\n* 🐞 patch\n\n## @ns/b v1.2.3\n\n* 🌱 minor\n* 🐞 patch\n',
    'should get markdown'
  )

  t.end()
})
