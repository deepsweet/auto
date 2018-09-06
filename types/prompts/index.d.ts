declare module 'prompts' {
  export = PromptFn;
}

declare function PromptFn (
  prompts: Prompt.PromptParameter | Array<Prompt.PromptParameter>,
  options?: Prompt.PromptOptions,
): Promise<{ [k: string]: any }>;

declare namespace Prompt {
  interface PromptOptions {
      onCancel: Function;
      onSubmit: Function;
  }

  type PromptParameter = Question |
      TextQuestion |
      PasswordQuestion |
      InvisibleQuestion |
      NumberQuestion |
      ListQuestion |
      ToggleQuestion |
      SelectQuestion |
      MultiSelectQuestion |
      AutoCompleteQuestion

  interface Choice {
      title: string;
      value: string | any;
      selected: boolean;
  }

  interface Question {
      type: string | Function;
      name: string | Function;
      message: string | Function;
      initial?: string | number | boolean | Function;
      format?: Function;
      onState?: Function;
  }

  interface HasStyle {
      style: string;
  }

  interface HasMaxControl {
      max: number;
  }

  interface HasMinControl {
      min: number;
  }

  interface HasSeparator {
      separator: string;
  }

  interface HasToggleControl {
      active: string;
      inactive: string;
  }

  interface HasChoices {
      choices: Array<Choice>;
  }

  interface HasHint {
      hint: string;
  }

  interface HasSuggestions {
      suggest: (input: string, choices: Array<Choice>) => Promise<Array<Choice>>
  }

  interface HasLimit {
      limit: number;
  }

  interface TextQuestion extends Question, HasStyle {}
  interface PasswordQuestion extends Question {}
  interface InvisibleQuestion extends Question {}
  interface NumberQuestion extends Question, HasStyle, HasMaxControl, HasMinControl {}
  interface ListQuestion extends Question, HasSeparator {}
  interface ToggleQuestion extends Question, HasToggleControl {}
  interface SelectQuestion extends Question, HasChoices {}
  interface MultiSelectQuestion extends Question, HasChoices, HasMaxControl, HasHint {}
  interface AutoCompleteQuestion extends Question, HasChoices, HasSuggestions, HasStyle, HasLimit {}
}
