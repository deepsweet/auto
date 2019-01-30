import { makeRegExp } from './make-regexp'
import { TPrompt } from './types'

export const suggestFilter = (noPackageMessage: string) =>
  (input: string, choices: TPrompt[]): Promise<TPrompt[]> => {
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
      firstElement = [{ title: noPackageMessage, value: '-' }]
    }

    return Promise.resolve([
      ...firstElement,
      ...choices.filter((choice) => choice.value.includes(input))
    ])
  }
