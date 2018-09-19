import test from 'blue-tape'
import { options } from '../../utils/test/options'
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

  t.equals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.dependencies.value} foo: dependencies change\nnew line`,
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.publish.value} foo: publish\nnew line`,
      options
    ),
    {
      name: '@ns/foo',
      type: 'publish',
      message: 'publish\nnew line'
    },
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.major.value} foo: breaking change\nnew line`,
      options
    ),
    {
      name: '@ns/foo',
      type: 'major',
      message: 'breaking change\nnew line'
    },
    'return major object'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.minor.value} foo: minor change\nnew line`,
      options
    ),
    {
      name: '@ns/foo',
      type: 'minor',
      message: 'minor change\nnew line'
    },
    'return minor object'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.patch.value} foo: patch change\nnew line`,
      options
    ),
    {
      name: '@ns/foo',
      type: 'patch',
      message: 'patch change\nnew line'
    },
    'return patch object'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo: initial change\nnew line`,
      options
    ),
    {
      name: '@ns/foo',
      type: 'initial',
      message: 'initial change\nnew line'
    },
    'return initial object'
  )
})
