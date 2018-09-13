import escapeStringRegexp from 'escape-string-regexp'

export type TPrompt = {
  title: string,
  value: string
}

export const makeRegExp = (input: string) => {
  const escapedInput = escapeStringRegexp(input).replace(/\\\*/g, '.*')

  return new RegExp(escapedInput)
}

export const suggestFilter = (input: string, choices: TPrompt[]): Promise<TPrompt[]> => {
  if (input.includes('*')) {
    const regExp = makeRegExp(input)
    let filteredChoices = choices.filter((choice) => regExp.test(choice.value))

    return Promise.resolve([
      { title: `${input} (${filteredChoices.length})`, value: input },
      ...filteredChoices
    ])
  }

  let firstElement: TPrompt[] = []

  if (input === '') {
    firstElement = [{ title: '(no package)', value: '' }]
  }

  return Promise.resolve([
    ...firstElement,
    ...choices.filter((choice) => choice.value.includes(input))
  ])
}