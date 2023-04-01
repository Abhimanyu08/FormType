"use client";
import { AnswerType, QuestionType } from "../../../types/QuestionInterface";

export interface FormStateInterface {
	questions: QuestionType;
	responses: AnswerType;
	previewing: boolean;
	questionOnShow: number;
	submit: boolean;
}
