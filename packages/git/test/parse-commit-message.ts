import test from 'blue-tape'
import { gitOptions } from './git-options'
import { parseCommitMessage } from '../src/parse-commit-message'

test('git:parseCommitMessage', async (t) => {
  t.equals(
    parseCommitMessage(
      '💩 foo: breaking change',
      gitOptions
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseCommitMessage(
      '🚨 foo: breaking change\nnew line',
      gitOptions
    ),
    {
      type: 'major',
      prefix: '🚨',
      package: '@ns/foo',
      message: 'breaking change\nnew line'
    },
    'return bump object'
  )
})
