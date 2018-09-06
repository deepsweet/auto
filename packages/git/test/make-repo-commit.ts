import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { options } from '../../utils/test/git-options'

test('git:makeRepoCommit', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())
  const promptsSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ prefix: 'prefix' })
    }

    return Promise.resolve({ message: 'message' })
  })

  mock('../src/make-repo-commit', {
    execa: { default: execaSpy },
    prompts: { default: promptsSpy }
  })

  const { makeRepoCommit } = await import('../src/make-repo-commit')

  await makeRepoCommit(options)

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', 'prefix message']]
    ],
    'should write proper message'
  )

  unmock('../src/make-repo-commit')
})
