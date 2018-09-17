import test from 'blue-tape'
import { getRepoMarkdownLog } from '../src/get-repo-markdown-log'
import { options } from '@auto/utils/test/options'

test('getRepoMarkdownLog', (t) => {
  t.deepEquals(
    getRepoMarkdownLog(
      {
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
      },
      options
    ),
    '## v1.2.3\n\n* 🌱 minor\n* 🐞 patch\n',
    'should get markdown'
  )

  t.end()
})
