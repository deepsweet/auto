import { TOptions } from '../src/types'

export const options: TOptions = {
  semverPrefixes: {
    major: {
      title: 'Breaking change',
      value: '💥'
    },
    minor: {
      title: 'New feature',
      value: '🌱'
    },
    patch: {
      title: 'Bugfix',
      value: '🐞'
    }
  },
  autoPrefixes: {
    publish: {
      title: 'New version',
      value: '📦'
    },
    dependencies: {
      title: 'Dependencies',
      value: '♻️'
    }
  },
  customPrefixes: [
    {
      title: 'Dependencies',
      value: '♻️'
    },
    {
      title: 'Lint',
      value: '🚷'
    },
    {
      title: 'Test',
      value: '👾'
    },
    {
      title: 'Docs',
      value: '📝'
    },
    {
      title: 'Demo',
      value: '📺'
    },
    {
      title: 'Refactor',
      value: '🛠'
    },
    {
      title: 'WIP',
      value: '🚧'
    },
    {
      title: 'Snapshots / Screenshots',
      value: '📸'
    },
    {
      title: 'Other',
      value: '🛠'
    }
  ],
  namespace: 'ns'
}
