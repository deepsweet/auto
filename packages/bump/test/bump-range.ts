import test from 'blue-tape'
import bumpRange from '../src/bump-range'
import { TBumpType } from '@auto/utils/src/'

test('semver:bumpRange', (t) => {
  t.strictEqual(bumpRange('1.2.3', '1.2.3', 'patch'), '1.2.4', '\'1.2.3\' bumped to \'1.2.4\' as patch')
  t.strictEqual(bumpRange('1.2', '1.2.3', 'patch'), '1.2.4', '\'1.2\' bumped to \'1.2.4\' as patch')
  t.strictEqual(bumpRange('1', '1.2.3', 'patch'), '1.2.4', '\'1\' bumped to \'1.2.4\' as patch')
  t.strictEqual(bumpRange('1.2.3', '1.2.3', 'minor'), '1.3.0', '\'1.2.3\' bumped to \'1.3.0\' as minor')
  t.strictEqual(bumpRange('1.2', '1.2.3', 'minor'), '1.3.0', '\'1.2\' bumped to \'1.3.0\' as minor')
  t.strictEqual(bumpRange('1', '1.2.3', 'minor'), '1.3.0', '\'1\' bumped to \'1.3.0\' as minor')
  t.strictEqual(bumpRange('1.2.3', '1.2.3', 'major'), '2.0.0', '\'1.2.3\' bumped to \'2.0.0\' as major')
  t.strictEqual(bumpRange('1.2', '1.2.3', 'major'), '2.0.0', '\'1.2\' bumped to \'2.0.0\' as major')
  t.strictEqual(bumpRange('1', '1.2.3', 'major'), '2.0.0', '\'1\' bumped to \'2.0.0\' as major')

  t.strictEqual(bumpRange('~1.2.3', '1.2.3', 'patch'), '~1.2.4', '\'~1.2.3\' bumped to \'~1.2.4\' as patch')
  t.strictEqual(bumpRange('~1.2', '1.2.3', 'patch'), '~1.2.4', '\'~1.2\' bumped to \'~1.2.4\' as patch')
  t.strictEqual(bumpRange('~1', '1.2.3', 'patch'), '~1.2.4', '\'~1\' bumped to \'~1.2.4\' as patch')
  t.strictEqual(bumpRange('~1.2.3', '1.2.3', 'minor'), '^1.3.0', '\'~1.2.3\' bumped to \'^1.3.0\' as minor')
  t.strictEqual(bumpRange('~1.2', '1.2.3', 'minor'), '^1.3.0', '\'~1.2\' bumped to \'^1.3.0\' as minor')
  t.strictEqual(bumpRange('~1', '1.2.3', 'minor'), '~1.3.0', '\'~1\' bumped to \'~1.3.0\' as minor')
  t.strictEqual(bumpRange('~1.2.3', '1.2.3', 'major'), '^2.0.0', '\'~1.2.3\' bumped to \'^2.0.0\' as major')
  t.strictEqual(bumpRange('~1.2', '1.2.3', 'major'), '^2.0.0', '\'~1.2\' bumped to \'^2.0.0\' as major')
  t.strictEqual(bumpRange('~1', '1.2.3', 'major'), '^2.0.0', '\'~1\' bumped to \'^2.0.0\' as major')

  t.strictEqual(bumpRange('^1.2.3', '1.2.3', 'patch'), '^1.2.4', '\'^1.2.3\' bumped to \'^1.2.4\' as patch')
  t.strictEqual(bumpRange('^1.2', '1.2.3', 'patch'), '^1.2.4', '\'^1.2\' bumped to \'^1.2.4\' as patch')
  t.strictEqual(bumpRange('^1', '1.2.3', 'patch'), '^1.2.4', '\'^1\' bumped to \'^1.2.4\' as patch')
  t.strictEqual(bumpRange('^1.2.3', '1.2.3', 'minor'), '^1.3.0', '\'^1.2.3\' bumped to \'^1.3.0\' as minor')
  t.strictEqual(bumpRange('^1.2', '1.2.3', 'minor'), '^1.3.0', '\'^1.2\' bumped to \'^1.3.0\' as minor')
  t.strictEqual(bumpRange('^1', '1.2.3', 'minor'), '^1.3.0', '\'^1\' bumped to \'^1.3.0\' as minor')
  t.strictEqual(bumpRange('^1.2.3', '1.2.3', 'major'), '^2.0.0', '\'^1.2.3\' bumped to \'^2.0.0\' as major')
  t.strictEqual(bumpRange('^1.2', '1.2.3', 'major'), '^2.0.0', '\'^1.2\' bumped to \'^2.0.0\' as major')
  t.strictEqual(bumpRange('^1', '1.2.3', 'major'), '^2.0.0', '\'^1\' bumped to \'^2.0.0\' as major')

  t.strictEqual(bumpRange('^0.2.3', '0.2.3', 'patch'), '^0.2.4', '\'^0.2.3\' bumped to \'^0.2.4\' as patch')
  t.strictEqual(bumpRange('^0.2', '0.2.3', 'patch'), '^0.2.4', '\'^0.2\' bumped to \'^0.2.4\' as patch')
  t.strictEqual(bumpRange('^0', '0.2.3', 'patch'), '^0.2.4', '\'^0\' bumped to \'^0.2.4\' as patch')
  t.strictEqual(bumpRange('^0.2.3', '0.2.3', 'minor'), '^0.3.0', '\'^0.2.4\' bumped to \'^0.3.0\' as minor')
  t.strictEqual(bumpRange('^0.2', '0.2.3', 'minor'), '^0.3.0', '\'^0.2\' bumped to \'^0.3.0\' as minor')
  t.strictEqual(bumpRange('^0', '0.2.3', 'minor'), '^0.3.0', '\'^0\' bumped to \'^0.3.0\' as minor')
  t.strictEqual(bumpRange('^0.2.3', '0.2.3', 'major'), '^1.0.0', '\'^0.2.4\' bumped to \'^1.0.0\' as major')
  t.strictEqual(bumpRange('^0.2', '0.2.3', 'major'), '^1.0.0', '\'^0.2\' bumped to \'^1.0.0\' as major')
  t.strictEqual(bumpRange('^0', '0.2.3', 'major'), '^1.0.0', '\'^0\' bumped to \'^1.0.0\' as major')

  t.throws(() => bumpRange('>1', '1.2.3', 'patch'), /is not supported/, 'should throw on range \'>1\'')
  t.throws(() => bumpRange('>=1', '1.2.3', 'patch'), /is not supported/, 'should throw on range \'>=1\'')
  t.throws(() => bumpRange('<1', '0.2.3', 'patch'), /is not supported/, 'should throw on range \'<1\'')
  t.throws(() => bumpRange('<=1', '0.2.3', 'patch'), /is not supported/, 'should throw on range \'<=1\'')
  t.throws(() => bumpRange('1.2 | 2.4', '1.2.3', 'patch'), /is not supported/, 'should throw on range \'1.2 | 2.4\'')
  t.throws(() => bumpRange('1.2.3', 'blabla', 'patch'), /invalid version/, 'should throw on version \'blabla\'')
  t.throws(() => bumpRange('blabla', '1.2.3', 'patch'), /invalid range/, 'should throw on range \'blabla\'')
  t.throws(() => bumpRange('1.2.3', '1.2.3', 'blabla' as TBumpType), /invalid increment argument/, 'should throw on release type \'blabla\'')
  t.throws(() => bumpRange('', '1.2.3', 'patch'), /is not supported/, 'should throw on empty range')
  t.end()
})
