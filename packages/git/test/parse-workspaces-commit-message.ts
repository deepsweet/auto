import test from 'blue-tape'
import { options } from '../../utils/test/options'
import { parseWorkspacesCommitMessage } from '../src/parse-workspaces-commit-message'

test('git:parseWorkspacesCommitMessage', (t) => {
  t.equals(
    parseWorkspacesCommitMessage(
      '🚨 foo: breaking change',
      ['@ns/foo'],
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.equals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.dependencies.value} foo: dependencies change\nnew line`,
      ['@ns/foo'],
      options
    ),
    null,
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.publish.value} foo: publish\nnew line`,
      ['@ns/foo'],
      options
    ),
    {
      names: ['@ns/foo'],
      type: 'publish',
      message: 'publish\nnew line'
    },
    'return `null` if nothing has been matched'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.major.value} foo: breaking change\nnew line`,
      ['@ns/foo'],
      options
    ),
    {
      names: ['@ns/foo'],
      type: 'major',
      message: 'breaking change\nnew line'
    },
    'return major'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.minor.value} foo: minor change\nnew line`,
      ['@ns/foo'],
      options
    ),
    {
      names: ['@ns/foo'],
      type: 'minor',
      message: 'minor change\nnew line'
    },
    'return minor'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.patch.value} foo: patch change\nnew line`,
      ['@ns/foo'],
      options
    ),
    {
      names: ['@ns/foo'],
      type: 'patch',
      message: 'patch change\nnew line'
    },
    'return patch'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo: initial change\nnew line`,
      ['@ns/foo'],
      options
    ),
    {
      names: ['@ns/foo'],
      type: 'initial',
      message: 'initial change\nnew line'
    },
    'return initial'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} *: message`,
      ['@ns/foo', '@ns/bar'],
      options
    ),
    {
      names: ['@ns/foo', '@ns/bar'],
      type: 'initial',
      message: 'message'
    },
    'return *'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo*: message`,
      ['@ns/foo', '@ns/foo1', '@ns/foo2', '@ns/bar'],
      options
    ),
    {
      names: ['@ns/foo', '@ns/foo1', '@ns/foo2'],
      type: 'initial',
      message: 'message'
    },
    'return foo*'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo,bar: message`,
      ['@ns/foo', '@ns/bar', '@ns/baz'],
      options
    ),
    {
      names: ['@ns/foo', '@ns/bar'],
      type: 'initial',
      message: 'message'
    },
    'return foo,bar'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo*,bar: message`,
      ['@ns/foo1', '@ns/foo2', '@ns/bar', '@ns/baz'],
      options
    ),
    {
      names: ['@ns/foo1', '@ns/foo2', '@ns/bar'],
      type: 'initial',
      message: 'message'
    },
    'return foo*,bar'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo*,ba*: message`,
      ['@ns/foo1', '@ns/foo2', '@ns/bar', '@ns/baz'],
      options
    ),
    {
      names: ['@ns/foo1', '@ns/foo2', '@ns/bar', '@ns/baz'],
      type: 'initial',
      message: 'message'
    },
    'return foo*,ba*'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo, , bar: message`,
      ['@ns/foo', '@ns/bar', '@ns/baz'],
      options
    ),
    {
      names: ['@ns/foo', '@ns/bar'],
      type: 'initial',
      message: 'message'
    },
    'return foo, , bar'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo, *: message`,
      ['@ns/foo', '@ns/foo1', '@ns/bar', '@ns/baz'],
      options
    ),
    {
      names: ['@ns/foo', '@ns/foo1', '@ns/bar', '@ns/baz'],
      type: 'initial',
      message: 'message'
    },
    'return foo, *'
  )

  t.deepEquals(
    parseWorkspacesCommitMessage(
      `${options.requiredPrefixes.initial.value} foo, baz: message`,
      ['@ns/foo', '@ns/bar'],
      options
    ),
    {
      names: ['@ns/foo'],
      type: 'initial',
      message: 'message'
    },
    'return foo, baz'
  )

  t.end()
})
