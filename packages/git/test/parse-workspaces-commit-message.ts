import test from 'blue-tape'
import { options } from '../../utils/test/git-options'
import { parseWorkspacesCommitMessage } from '../src/parse-workspaces-commit-message'

test('git:parseWorkspacesCommitMessage', async (t) => {
  t.equals(
    parseWorkspacesCommitMessage(
      '🚨 foo: breaking change',
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.semverPrefixes.major.value} foo: breaking change\nnew line`,
      options
    ),
    {
      type: 'major',
      name: '@ns/foo',
      message: 'breaking change\nnew line'
    },
    'return bump object'
  )
})
