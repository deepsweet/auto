/* eslint-disable prefer-promise-reject-errors */
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'

test('npm:publishPackage', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-package', {
    execa: { default: execaSpy }
  })

  const { publishPackage } = await import('../src/publish-package')

  await publishPackage({
    name: 'baz',
    dir: '/foo/bar/baz',
    version: '1.2.3',
    type: 'minor',
    deps: null,
    devDeps: null
  })

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['npm', ['publish', '/foo/bar/baz']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/publish-package')
})

test('npm:publishPackage: throw error', async (t) => {
  const execaSpy = createSpy(() => {
    throw new Error('error')
  })

  mock('../src/publish-package', {
    execa: { default: execaSpy }
  })

  const { publishPackage } = await import('../src/publish-package')

  try {
    await publishPackage({
      name: 'baz',
      dir: '/foo/bar/baz',
      version: '1.2.3',
      type: 'minor',
      deps: null,
      devDeps: null
    })

    t.fail('should not get here')
  } catch (err) {
    t.equals(err, null, 'error should be null')
  }

  unmock('../src/publish-package')
})
