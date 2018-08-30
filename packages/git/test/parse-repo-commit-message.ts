import test from 'blue-tape'
import { options } from '../../utils/test/git-options'
import { parseRepoCommitMessage } from '../src/parse-repo-commit-message'

test('git:parseWorkspacesCommitMessage', async (t) => {
  t.equals(
    parseRepoCommitMessage(
      '💩 breaking change',
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      '🚨 breaking change\nnew line',
      options
    ),
    {
      type: 'major',
      prefix: '🚨',
      message: 'breaking change\nnew line'
    },
    'return bump object'
  )
})
