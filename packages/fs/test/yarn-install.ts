import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('fs:yarnInstall', async (t) => {
  const execaSpy = createSpy(() => Promise.resolve())

  mock('../src/yarn-install', {
    execa: { default: execaSpy }
  })

  const { yarnInstall } = await import('../src/yarn-install')

  await yarnInstall()

  t.deepEquals(
    getSpyCalls(execaSpy).map((call) => call.slice(0, 2)),
    [
      ['yarn', ['install']]
    ],
    'should install'
  )

  unmock('../src/yarn-install')
})
