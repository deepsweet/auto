/* eslint-disable prefer-promise-reject-errors */
import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'
import { ExecaError } from 'execa'

test('npm:getRemoteVersion', async (t) => {
  const execaSpy = createSpy(({ index }) => {
    if (index === 0) {
      return Promise.resolve({ stdout: '0.1.2' })
    }

    const err = new Error('oops') as ExecaError

    if (index === 1) {
      err.stderr = 'code E404'

      throw err
    }

    err.stderr = 'oops'

    throw err
  })

  mock('../src/get-remote-version', {
    execa: { default: execaSpy }
  })

  const { getRemoteVersion } = await import('../src/get-remote-version')

  t.equal(
    await getRemoteVersion('foo'),
    '0.1.2',
    'should return package version'
  )

  t.equal(
    await getRemoteVersion('bar'),
    null,
    'should return null if there is no such a package'
  )

  try {
    await getRemoteVersion('baz')
    t.fail()
  } catch (err) {
    t.equal(
      err.message,
      'oops',
      'should throw'
    )
  }

  t.deepEquals(
    getSpyCalls(execaSpy),
    [
      ['npm', ['view', 'foo', 'version']],
      ['npm', ['view', 'bar', 'version']],
      ['npm', ['view', 'baz', 'version']]
    ],
    'should spawn NPM with necessary arguments'
  )

  unmock('../src/get-remote-version')
})
