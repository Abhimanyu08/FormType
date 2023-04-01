import { AnswerType, QuestionType } from "./QuestionInterface"

export type QuestionTable = {
    id: number
    questions: QuestionType
}

export type ResponseTable = {
    id: number
    created_at: string
    form: number
    response_data: AnswerType
}