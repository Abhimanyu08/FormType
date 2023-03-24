import React, { useContext } from "react";
import { QuestionType, ResponseType } from "../QuestionInterface";
import { FormContext } from "../FormContext";

function QuestionResponse({ question }: { question: QuestionType }) {
	const { formState } = React.useContext(FormContext);

	const { dispatch } = useContext(FormContext);
	const handleSubmit = () => {
		const inputEl = document.getElementById(
			`response-${question.id}`
		) as HTMLInputElement;

		dispatch({
			type: "add response",
			payload: {
				questionId: question.id,
				content: inputEl.value,
			} as ResponseType,
		});
		dispatch({
			type: "show question",
			payload: question.id + 1,
		});
	};
	return (
		<>
			<input
				id={`response-${question.id}`}
				type={question.type}
				className="bg-transparent text-2xl text-white focus:outline-none border-b-[1px] border-white"
				placeholder="name@example.com"
				disabled={!formState.previewing}
			/>
			<button
				className="bg-blue-500 text-white w-fit px-5 py-1 rounded-md"
				onClick={handleSubmit}
			>
				Ok
			</button>
		</>
	);
}

export default QuestionResponse;
