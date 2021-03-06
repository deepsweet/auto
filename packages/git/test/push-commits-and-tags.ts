import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:pushCommitsAndTags', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/push-commits-and-tags', {
    execa: { default: execaSpy }
  })

  const { pushCommitsAndTags } = await import('../src/push-commits-and-tags')

  await pushCommitsAndTags()

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['push', '--follow-tags']]
    ],
    'should push'
  )

  unmock('../src/push-commits-and-tags')
})
