import { TOptions } from '../src/types'

export const options: TOptions = {
  requiredPrefixes: {
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
    },
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
  autoNamePrefix: '@ns/',
  zeroMajorBump: 'minor',
  github: {
    username: 'username',
    repo: 'repo'
  },
  slack: {
    username: 'username',
    channel: 'channel',
    iconEmoji: 'emoji',
    colors: {
      major: 'major',
      minor: 'minor',
      patch: 'patch'
    }
  }
}
