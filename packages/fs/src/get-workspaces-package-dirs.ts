import fastGlob from 'fast-glob'

export const getWorkspacesPackageDirs = async () => {
  const { workspaces } = await import(`${process.cwd()}/package.json`)

  return fastGlob(workspaces, {
    onlyDirectories: true,
    onlyFiles: false,
    absolute: true
  }) as Promise<string[]>
}
