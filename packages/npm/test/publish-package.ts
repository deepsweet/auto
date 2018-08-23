/* eslint-disable prefer-promise-reject-errors */
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { ExecaError } from 'execa'

test('npm:publishPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy }
  })

  const { default: publishPackage } = await import('../src/publish-package')

  await publishPackage('/foo/bar/baz')

  t.deepEquals(
    getSpyCalls(execaSpy),
    [
      ['npm', ['publish', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})
