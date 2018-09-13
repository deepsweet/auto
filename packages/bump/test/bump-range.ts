import test from 'blue-tape'
import { bumpRange } from '../src/bump-range'
import { TBumpType, TOptions } from '@auto/utils/src/'
import { options } from '../../utils/test/options'

test('bump:bumpRange', (t) => {
  t.strictEquals(bumpRange('1.2.3', '1.2.3', 'patch', options), '1.2.4', '\'1.2.3\' bumped to \'1.2.4\' as patch')
  t.strictEquals(bumpRange('1.2', '1.2.3', 'patch', options), '1.2.4', '\'1.2\' bumped to \'1.2.4\' as patch')
  t.strictEquals(bumpRange('1', '1.2.3', 'patch', options), '1.2.4', '\'1\' bumped to \'1.2.4\' as patch')
  t.strictEquals(bumpRange('1.2.3', '1.2.3', 'minor', options), '1.3.0', '\'1.2.3\' bumped to \'1.3.0\' as minor')
  t.strictEquals(bumpRange('1.2', '1.2.3', 'minor', options), '1.3.0', '\'1.2\' bumped to \'1.3.0\' as minor')
  t.strictEquals(bumpRange('1', '1.2.3', 'minor', options), '1.3.0', '\'1\' bumped to \'1.3.0\' as minor')
  t.strictEquals(bumpRange('1.2.3', '1.2.3', 'major', options), '2.0.0', '\'1.2.3\' bumped to \'2.0.0\' as major')
  t.strictEquals(bumpRange('1.2', '1.2.3', 'major', options), '2.0.0', '\'1.2\' bumped to \'2.0.0\' as major')
  t.strictEquals(bumpRange('1', '1.2.3', 'major', options), '2.0.0', '\'1\' bumped to \'2.0.0\' as major')

  t.strictEquals(bumpRange('~1.2.3', '1.2.3', 'patch', options), '~1.2.4', '\'~1.2.3\' bumped to \'~1.2.4\' as patch')
  t.strictEquals(bumpRange('~1.2', '1.2.3', 'patch', options), '~1.2.4', '\'~1.2\' bumped to \'~1.2.4\' as patch')
  t.strictEquals(bumpRange('~1', '1.2.3', 'patch', options), '~1.2.4', '\'~1\' bumped to \'~1.2.4\' as patch')
  t.strictEquals(bumpRange('~1.2.3', '1.2.3', 'minor', options), '^1.3.0', '\'~1.2.3\' bumped to \'^1.3.0\' as minor')
  t.strictEquals(bumpRange('~1.2', '1.2.3', 'minor', options), '^1.3.0', '\'~1.2\' bumped to \'^1.3.0\' as minor')
  t.strictEquals(bumpRange('~1', '1.2.3', 'minor', options), '~1.3.0', '\'~1\' bumped to \'~1.3.0\' as minor')
  t.strictEquals(bumpRange('~1.2.3', '1.2.3', 'major', options), '^2.0.0', '\'~1.2.3\' bumped to \'^2.0.0\' as major')
  t.strictEquals(bumpRange('~1.2', '1.2.3', 'major', options), '^2.0.0', '\'~1.2\' bumped to \'^2.0.0\' as major')
  t.strictEquals(bumpRange('~1', '1.2.3', 'major', options), '^2.0.0', '\'~1\' bumped to \'^2.0.0\' as major')

  t.strictEquals(bumpRange('^1.2.3', '1.2.3', 'patch', options), '^1.2.4', '\'^1.2.3\' bumped to \'^1.2.4\' as patch')
  t.strictEquals(bumpRange('^1.2', '1.2.3', 'patch', options), '^1.2.4', '\'^1.2\' bumped to \'^1.2.4\' as patch')
  t.strictEquals(bumpRange('^1', '1.2.3', 'patch', options), '^1.2.4', '\'^1\' bumped to \'^1.2.4\' as patch')
  t.strictEquals(bumpRange('^1.2.3', '1.2.3', 'minor', options), '^1.3.0', '\'^1.2.3\' bumped to \'^1.3.0\' as minor')
  t.strictEquals(bumpRange('^1.2', '1.2.3', 'minor', options), '^1.3.0', '\'^1.2\' bumped to \'^1.3.0\' as minor')
  t.strictEquals(bumpRange('^1', '1.2.3', 'minor', options), '^1.3.0', '\'^1\' bumped to \'^1.3.0\' as minor')
  t.strictEquals(bumpRange('^1.2.3', '1.2.3', 'major', options), '^2.0.0', '\'^1.2.3\' bumped to \'^2.0.0\' as major')
  t.strictEquals(bumpRange('^1.2', '1.2.3', 'major', options), '^2.0.0', '\'^1.2\' bumped to \'^2.0.0\' as major')
  t.strictEquals(bumpRange('^1', '1.2.3', 'major', options), '^2.0.0', '\'^1\' bumped to \'^2.0.0\' as major')

  t.strictEquals(bumpRange('^0.2.3', '0.2.3', 'patch', options), '^0.2.4', '\'^0.2.3\' bumped to \'^0.2.4\' as patch')
  t.strictEquals(bumpRange('^0.2', '0.2.3', 'patch', options), '^0.2.4', '\'^0.2\' bumped to \'^0.2.4\' as patch')
  t.strictEquals(bumpRange('^0', '0.2.3', 'patch', options), '^0.2.4', '\'^0\' bumped to \'^0.2.4\' as patch')
  t.strictEquals(bumpRange('^0.2.3', '0.2.3', 'minor', options), '^0.3.0', '\'^0.2.4\' bumped to \'^0.3.0\' as minor')
  t.strictEquals(bumpRange('^0.2', '0.2.3', 'minor', options), '^0.3.0', '\'^0.2\' bumped to \'^0.3.0\' as minor')
  t.strictEquals(bumpRange('^0', '0.2.3', 'minor', options), '^0.3.0', '\'^0\' bumped to \'^0.3.0\' as minor')
  t.strictEquals(bumpRange('^0.2.3', '0.2.3', 'major', options), '^0.3.0', '\'^0.2.4\' bumped to \'^0.3.0\' as major')
  t.strictEquals(bumpRange('^0.2', '0.2.3', 'major', options), '^0.3.0', '\'^0.2\' bumped to \'^0.3.0\' as major')
  t.strictEquals(bumpRange('^0', '0.2.3', 'major', options), '^0.3.0', '\'^0\' bumped to \'^0.3.0\' as major')

  const majorOptions: TOptions = { ...options, zeroMajorBump: 'major' }
  t.strictEquals(bumpRange('^0.2.3', '0.2.3', 'major', majorOptions), '^1.0.0', '\'^0.2.4\' bumped to \'^1.0.0\' as major')
  t.strictEquals(bumpRange('^0.2', '0.2.3', 'major', majorOptions), '^1.0.0', '\'^0.2\' bumped to \'^1.0.0\' as major')
  t.strictEquals(bumpRange('^0', '0.2.3', 'major', majorOptions), '^1.0.0', '\'^0\' bumped to \'^1.0.0\' as major')

  t.throws(() => bumpRange('>1', '1.2.3', 'patch', options), /is not supported/, 'should throw on range \'>1\'')
  t.throws(() => bumpRange('>=1', '1.2.3', 'patch', options), /is not supported/, 'should throw on range \'>=1\'')
  t.throws(() => bumpRange('<1', '0.2.3', 'patch', options), /is not supported/, 'should throw on range \'<1\'')
  t.throws(() => bumpRange('<=1', '0.2.3', 'patch', options), /is not supported/, 'should throw on range \'<=1\'')
  t.throws(() => bumpRange('1.2 | 2.4', '1.2.3', 'patch', options), /is not supported/, 'should throw on range \'1.2 | 2.4\'')
  t.throws(() => bumpRange('1.2.3', 'blabla', 'patch', options), /invalid version/, 'should throw on version \'blabla\'')
  t.throws(() => bumpRange('1.2.3', '1.2.3', 'blabla' as TBumpType, options), /invalid increment argument/, 'should throw on release type \'blabla\'')
  t.throws(() => bumpRange('', '1.2.3', 'patch', options), /is not supported/, 'should throw on empty range')
  t.end()
})
