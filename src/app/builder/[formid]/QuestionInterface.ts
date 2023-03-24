export interface QuestionType {

    id: number,
    type: "text" | "email" | "phone" | "select",
    content: string
    description?: string
}

export interface ResponseType { questionId: number; content: string | number | string[] }



