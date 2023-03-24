import React, { useContext } from "react";
import { FormContext } from "../FormContext";
import { QuestionType, ResponseType } from "../QuestionInterface";
import QuestionInput from "./QuestionInput";
import QuestionResponse from "./QuestionResponse";

function Question({
	question,
	showId,
}: {
	question: QuestionType;
	showId: number;
}) {
	return (
		<div
			className={`w-full h-full flex flex-col justify-center items-center transition-transform`}
			style={{
				transform: `translateY(-${(showId - 1) * 100}%)`,
			}}
		>
			<div className="w-[700px] text-xl font-mono flex flex-col gap-4">
				<QuestionInput question={question} />
				{question.description && <p>{question.description}</p>}
				<QuestionResponse question={question} />
			</div>
		</div>
	);
}

export default Question;
