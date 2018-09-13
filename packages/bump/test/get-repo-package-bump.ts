import test from 'blue-tape'
import { getRepoPackageBump } from '../src/get-repo-package-bump'
import { options } from '../../utils/test/git-options'

test('bump:getRepoPackageBump', (t) => {
  t.deepEquals(
    getRepoPackageBump(
      { name: '@ns/a', version: '1.2.3' },
      { type: 'patch', messages: [] },
      options
    ),
    { type: 'patch', version: '1.2.4' },
    '\'1.2.3\' bumped to \'1.2.4\' as patch'
  )

  t.end()
})
