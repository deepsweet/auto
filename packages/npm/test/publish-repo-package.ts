/* eslint-disable prefer-promise-reject-errors */
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'

test('npm:publishRepoPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy }
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  await publishRepoPackage()

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-repo-package')
})

test('npm:publishRepoPackage: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/publish-repo-package', {
    execa: { default: execaSpy }
  })

  const { publishRepoPackage } = await import('../src/publish-repo-package')

  try {
    await publishRepoPackage()

    t.fail('should not get here')
  } catch (err) {
    t.equals(err, null, 'error should be null')
  }

  unmock('../src/publish-repo-package')
})
