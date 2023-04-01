import React, { useContext } from "react";
import { FormContext } from "../FormContext";
import QuestionInput from "./QuestionInput";
import QuestionResponse from "../../../components/QuestionResponse";
import { QuestionType } from "@/types/QuestionInterface";

function Question({
	id,
	question,
}: {
	id: number;
	question: Partial<QuestionType[number]>;
}) {
	const { formState } = useContext(FormContext);
	return (
		<div
			className={`w-full px-20 gap-4 h-full rounded-md aspect-video   bg-black flex flex-col justify-center items-center transition-transform`}
			style={{
				transform: `translateY(-${formState.questionOnShow * 100}%)`,
			}}
		>
			<QuestionInput {...{ id, question }} />
			<QuestionResponse {...{ id, question }} context={FormContext} />
		</div>
	);
}

export default Question;
