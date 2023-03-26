import React, { useContext } from "react";
import { FormContext } from "../FormContext";
import { QuestionType, ResponseType } from "../QuestionInterface";
import QuestionInput from "./QuestionInput";
import QuestionResponse from "./QuestionResponse";

function Question({ question }: { question: Partial<QuestionType> }) {
	const { formState } = useContext(FormContext);
	return (
		<div
			className={`w-full px-20 gap-4  rounded-md aspect-video  bg-black flex flex-col justify-center items-center transition-transform`}
			style={{
				transform: `translateY(-${
					(formState.questionOnShow - 1) * 100
				}%)`,
			}}
		>
			<QuestionInput question={question} />
			<QuestionResponse question={question} />
		</div>
	);
}

export default Question;
