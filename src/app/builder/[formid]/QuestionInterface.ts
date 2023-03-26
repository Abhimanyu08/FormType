

export const QuestionOptions = ["text", "email", "phone", "select", "choice", "number"] as const


export interface Question {
    id: number,
    type: typeof QuestionOptions[number],
    content: string,
    description?: string
    required: boolean
}

export interface SelectQuestion extends Question {
    type: "select",
    options: string[]
}

export interface ChoiceQuestion extends Question {
    type: "choice",
    options: string[]
    minChoices: number
    maxChoices: number
}


export type QuestionType = Question | SelectQuestion | ChoiceQuestion
export interface ResponseType { questionId: number; content: string | string[] | number }
