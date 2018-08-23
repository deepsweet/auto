import test from 'blue-tape'
import { mock, unmock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'
import { TPackages } from '@auto/deps/src/'

test('npm:publish', async (t) => {
  const getPackagesSpy = createSpy((): Promise<TPackages> => Promise.resolve(({
    a: {
      path: '/fakes/a/package.json',
      json: {
        name: '@ns/a',
        version: '0.1.2'
      }
    },
    b: {
      path: '/fakes/b/package.json',
      json: {
        name: '@ns/b',
        version: '1.2.3'
      }
    }
  })))
  const getRemoteVersionSpy = createSpy(({ args }): Promise<string | null> => {
    switch (args[0]) {
      case '@ns/a': {
        return Promise.resolve('0.1.1')
      }
      case '@ns/b': {
        return Promise.resolve('1.2.3')
      }
      default: {
        return Promise.resolve(null)
      }
    }
  })
  const publishPackageSpy = createSpy(() => Promise.resolve())

  mock('../src/publish-packages', {
    './get-packages': {
      default: getPackagesSpy
    },
    './get-remote-version': {
      default: getRemoteVersionSpy
    },
    './publish-package': {
      default: publishPackageSpy
    }
  })

  const { default: publish } = await import('../src/publish-packages')

  await publish()

  t.deepEquals(
    getSpyCalls(getPackagesSpy),
    [[]],
    'should call getPackages'
  )

  t.deepEquals(
    getSpyCalls(getRemoteVersionSpy),
    [
      ['@ns/a'],
      ['@ns/b']
    ],
    'should call getRemoteVersion'
  )

  t.deepEquals(
    getSpyCalls(publishPackageSpy),
    [
      ['/fakes/a']
    ],
    'should call publishPackage'
  )

  unmock('../src/publish-packages')
})
