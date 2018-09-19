import test from 'blue-tape'
import { options } from '../../utils/test/options'
import { parseRepoCommitMessage } from '../src/parse-repo-commit-message'

test('git:parseWorkspacesCommitMessage', async (t) => {
  t.equals(
    parseRepoCommitMessage(
      '🚨 breaking change',
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.equals(
    parseRepoCommitMessage(
      `${options.requiredPrefixes.dependencies.value} dependencies change\nnew line`,
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${options.requiredPrefixes.publish.value} publish\nnew line`,
      options
    ),
    {
      type: 'publish',
      message: 'publish\nnew line'
    },
    'return publish object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${options.requiredPrefixes.major.value} breaking change\nnew line`,
      options
    ),
    {
      type: 'major',
      message: 'breaking change\nnew line'
    },
    'return major object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${options.requiredPrefixes.minor.value} minor change\nnew line`,
      options
    ),
    {
      type: 'minor',
      message: 'minor change\nnew line'
    },
    'return minor object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${options.requiredPrefixes.patch.value} patch change\nnew line`,
      options
    ),
    {
      type: 'patch',
      message: 'patch change\nnew line'
    },
    'return patch object'
  )

  t.deepEquals(
    parseRepoCommitMessage(
      `${options.requiredPrefixes.initial.value} initial change\nnew line`,
      options
    ),
    {
      type: 'initial',
      message: 'initial change\nnew line'
    },
    'return initial object'
  )
})
