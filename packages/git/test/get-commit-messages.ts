import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:getCommitMessages', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve({
    stdout: 'second commit\nfirst commit'
  }))

  mock('../src/get-commit-messages', {
    execa: { default: execaSpy }
  })

  const { getCommitMessages } = await import('../src/get-commit-messages')

  t.deepEquals(
    await getCommitMessages(),
    ['second commit', 'first commit'],
    'return commit messages'
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['log', '--pretty=format:%s', '--no-merges', '--first-parent']]
    ],
    'should spawn git with arguments'
  )

  unmock('../src/get-commit-messages')
})
