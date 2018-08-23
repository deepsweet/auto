import test from 'blue-tape'
import bumpVersion from '../src/bump-version'
import { TBumpType } from '@auto/utils/src/'

test('semver:bump', (t) => {
  t.strictEqual(bumpVersion('1.2.3', 'patch'), '1.2.4', '\'1.2.3\' bumped to \'1.2.4\' as patch')
  t.strictEqual(bumpVersion('1.2', 'patch'), '1.2.1', '\'1.2\' bumped to \'1.2.1\' as patch')
  t.strictEqual(bumpVersion('1', 'patch'), '1.0.1', '\'1\' bumped to \'1.0.1\' as patch')
  t.strictEqual(bumpVersion('1.2.3', 'minor'), '1.3.0', '\'1.2.3\' bumped to \'1.3.0\' as minor')
  t.strictEqual(bumpVersion('1.2', 'minor'), '1.3.0', '\'1.2\' bumped to \'1.3.0\' as minor')
  t.strictEqual(bumpVersion('1', 'minor'), '1.1.0', '\'1\' bumped to \'1.1.0\' as minor')
  t.strictEqual(bumpVersion('1.2.3', 'major'), '2.0.0', '\'1.2.3\' bumped to \'2.0.0\' as major')
  t.strictEqual(bumpVersion('1.2', 'major'), '2.0.0', '\'1.2\' bumped to \'2.0.0\' as major')
  t.strictEqual(bumpVersion('1', 'major'), '2.0.0', '\'1\' bumped to \'2.0.0\' as major')

  t.throws(() => bumpVersion('blabla', 'patch'), /invalid version/, 'should throw on range \'blabla\'')
  t.throws(() => bumpVersion('1.2.3', 'blabla' as TBumpType), /invalid increment argument/, 'should throw on release type \'blabla\'')
  t.throws(() => bumpVersion('', 'patch'), /invalid version/, 'should throw on empty range')

  t.end()
})
