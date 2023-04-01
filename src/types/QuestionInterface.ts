

export const QuestionOptions = ["text", "email", "phone", "select", "choice", "number"] as const

export type LogicState = {
    alwaysGoTo?: number
    leftOperand: number;
    operator: string;
    rightOperand: AnswerType[number]
    destination: number;
};

export interface Question {
    [key: number]: {

        type: typeof QuestionOptions[number],
        content: string,
        description?: string
        required: boolean
        nextLogic?: LogicState
        prev: number
    }
}

export interface SelectQuestion {
    [key: number]: Question[number] & {
        type: "select"
        options: string[]
    }
}

export interface ChoiceQuestion {
    [key: number]: Question[number] & {

        type: "choice",
        options: string[]
        numChoices: number

    }
}


export type QuestionType = Question | SelectQuestion | ChoiceQuestion
export interface AnswerType { [key: number]: string | string[] | number }
