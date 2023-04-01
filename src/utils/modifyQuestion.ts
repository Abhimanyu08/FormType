import { AnswerType } from "@/types/QuestionInterface";

export default function modifyQuestion(questionTexT: string, responses: AnswerType) {

    const newQuestionText = questionTexT.replaceAll(
        /\/([0-9])/g,
        (_, questionNumber) => {
            return (
                responses[
                    parseInt(questionNumber)
                ]?.toString() || ""
            );
        }
    );

    return newQuestionText

}