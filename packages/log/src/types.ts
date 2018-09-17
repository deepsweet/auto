export type TSlackOptions = {
  token: string,
  channel: string,
  username: string,
  iconEmoji: string,
  colors: {
    major: string,
    minor: string,
    patch: string
  }
}

export type TGithubOptions = {
  token: string,
  username: string,
  repo: string
}
