"use client";
import QuestionResponse from "@/components/QuestionResponse";
import { AnswerType, QuestionType } from "@/types/QuestionInterface";
import modifyQuestion from "@/utils/modifyQuestion";
import { Context, useEffect } from "react";

export function QuestionPreview({
	id,
	questionOnShow,
	question,
	responses,
	context,
	last = false,
}: {
	id: number;
	questionOnShow: number;
	question: Partial<QuestionType[number]>;
	responses: AnswerType;
	context: Context<any>;
	last: boolean;
}) {
	return (
		<div
			className={`w-full h-full transition-transform duration-500 flex justify-center`}
			style={{
				transform: `translateY(-${questionOnShow * 100}%)`,
			}}
		>
			<div className="flex flex-col gap-8 w-1/2 h-full justify-center">
				<div className="flex flex-col w-full gap-2">
					<p className="w-full text-2xl break-words relative">
						<span className="absolute -left-8 top-1 text-base">
							{id}➔
						</span>
						{modifyQuestion(question?.content || "", responses)}
						{question.required && "*"}
					</p>
					{question.description && (
						<div className="w-full text-xl text-white/70">
							{question.description}
						</div>
					)}
				</div>
				<QuestionResponse
					{...{ id, question, context, last }}
					key={responses[id]?.toString() || ""}
					answer={responses[id]}
				/>
			</div>
		</div>
	);
}
