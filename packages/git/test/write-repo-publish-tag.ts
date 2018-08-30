import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('git:writeRepoPublishTag: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-repo-publish-tag', {
    execa: { default: execaSpy }
  })

  const { writeRepoPublishTag } = await import('../src/write-repo-publish-tag')

  await writeRepoPublishTag(
    {
      type: 'patch',
      version: '0.1.1'
    }
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['tag', '-m', 'v0.1.1', 'v0.1.1']]
    ],
    'single package'
  )

  unmock('../src/write-repo-publish-tag')
})

test('git:writeRepoPublishTag: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/write-repo-publish-tag', {
    execa: { default: execaSpy }
  })

  const { writeRepoPublishTag } = await import('../src/write-repo-publish-tag')

  try {
    await writeRepoPublishTag(
      {
        type: 'major',
        version: '1.0.0'
      }
    )

    t.fail('should not get here')
  } catch (err) {
    t.equals(err, null, 'error should be null')
  }

  unmock('../src/write-repo-publish-tag')
})
