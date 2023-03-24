import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../FormContext";
import { QuestionType, ResponseType } from "../QuestionInterface";

function QuestionInput({ question }: { question: QuestionType }) {
	const { formState, dispatch } = useContext(FormContext);

	const [showQuestions, setShowQuestions] = useState(false);

	const handleSlash: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "/") {
			setShowQuestions(true);
			return;
		}
		if (showQuestions) setShowQuestions(false);
	};

	useEffect(() => {
		if (formState.previewing) {
			dispatch({
				type: "modify question",
				payload: {
					...question,
					content: (
						document.getElementById(
							`question-${question.id}`
						) as HTMLInputElement
					).value,
				},
			});
		}
	}, [formState.previewing]);

	return (
		<div className="w-full flex items-center gap-2 relative">
			{" "}
			<span className="text-sm">{question.id}→ </span>
			<input
				id={`question-${question.id}`}
				type="text"
				placeholder={
					"Press / to refer to responses of previous questions"
				}
				className="bg-transparent  focus:outline-none basis-full break-words"
				onKeyDown={handleSlash}
			/>
			<select
				id="question-referrer"
				className={`flex flex-col w-44 text-xs  bg-blue-500 text-white font-semibold border-2  rounded-md absolute right-0 divide-y-2 ${
					showQuestions ? "" : "invisible"
				}`}
				onChange={(e) => {
					setShowQuestions(false);
					const inputEl = document.getElementById(
						`question-${question.id}`
					) as HTMLInputElement;
					inputEl.value += e.target.value;
					inputEl.focus();
				}}
			>
				<option value="None">Select a question</option>
				{formState.questions.map((q) => {
					if (q.id < question.id) {
						return (
							<option
								value={q.id}
								className="truncate break-words px-2 py-2 hover:bg-cyan-400 hover:text-black"
							>
								<span>{q.id}.</span>
								{q.content}
							</option>
						);
					}
				})}
			</select>
		</div>
	);
}

export default QuestionInput;
