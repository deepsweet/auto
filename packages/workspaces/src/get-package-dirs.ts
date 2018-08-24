import fastGlob from 'fast-glob'

export const getPackageDirs = async () => {
  const { workspaces } = await import(`${process.cwd()}/package.json`)

  return fastGlob(workspaces, {
    onlyDirectories: true,
    onlyFiles: false,
    absolute: true
  }) as Promise<string[]>
}
