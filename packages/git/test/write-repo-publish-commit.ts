import path from 'path'
import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { options } from '../../utils/test/git-options'

test('git:writeRepoPublishCommit: single package', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/write-repo-publish-commit', {
    execa: { default: execaSpy }
  })

  const { writeRepoPublishCommit } = await import('../src/write-repo-publish-commit')
  const packageJsonPath = path.join(process.cwd(), 'package.json')

  await writeRepoPublishCommit(
    {
      type: 'patch',
      version: '0.1.1'
    },
    options
  )

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['git', ['commit', '-m', '📦 v0.1.1', packageJsonPath]]
    ],
    'single package'
  )

  unmock('../src/write-repo-publish-commit')
})
