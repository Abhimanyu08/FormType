import React, { useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "../FormContext";
import { QuestionType, ResponseType } from "../QuestionInterface";

function QuestionInput({ question }: { question: Partial<QuestionType> }) {
	const { formState, dispatch } = useContext(FormContext);

	const [showQuestions, setShowQuestions] = useState(false);

	const questionInputRef = useRef<HTMLInputElement | null>(null);
	const descriptionInputRef = useRef<HTMLInputElement | null>(null);

	const handleSlash: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === "/") {
			setShowQuestions(true);
			return;
		}
		if (showQuestions) setShowQuestions(false);
	};

	useEffect(() => {
		dispatch({
			type: "modify question",
			payload: {
				...question,
				content: (questionInputRef.current as HTMLInputElement).value,
				description: (descriptionInputRef.current as HTMLInputElement)
					.value,
			},
		});
	}, [formState.previewing, formState.questionOnShow]);

	useEffect(() => {
		// this useEffect will take care of referencing to previous questions' responses.

		if (
			formState.previewing &&
			questionInputRef.current &&
			formState.questionOnShow === question.id
		) {
			let valueString = questionInputRef.current.value;
			valueString = valueString.replace(
				/\/([0-9])/g,
				(_, questionNumber) => {
					return (
						formState.responses
							.at(parseInt(questionNumber) - 1)
							?.content.toString() || ""
					);
				}
			);
			questionInputRef.current.value = valueString;
		}
	}, [formState.questionOnShow]);

	return (
		<>
			<div className="w-full flex items-center gap-2 relative">
				{" "}
				<span className="text-sm">{question.id}→ </span>
				<input
					id={`question-${question.id}`}
					ref={questionInputRef}
					type="text"
					placeholder={
						"Press / to refer to responses of previous questions"
					}
					className="bg-transparent text-lg focus:outline-none basis-full break-words"
					onKeyDown={handleSlash}
					disabled={formState.previewing}
				/>
				<select
					id="question-referrer"
					className={`flex flex-col w-44 text-xs bg-blue-500 text-white font-semibold border-2 rounded-md absolute right-0 divide-y-2 ${
						showQuestions ? "" : "invisible"
					}`}
					onChange={(e) => {
						setShowQuestions(false);
						const inputEl =
							questionInputRef.current as HTMLInputElement;
						inputEl.value += e.target.value;
						inputEl.focus();
					}}
				>
					<option value="None">Select a question</option>
					{formState.questions.map((q) => {
						if ((q.id || 0) < question.id!) {
							return (
								<option
									key={q.id}
									value={q.id}
									className="truncate break-words px-2 py-2 hover:bg-cyan-400 hover:text-black"
								>
									{q.content}
								</option>
							);
						}
					})}
				</select>
			</div>
			<input
				id={`description-${question.id}`}
				type="text"
				placeholder={"Enter description (Optional)"}
				ref={descriptionInputRef}
				className="bg-transparent text-lg w-full focus:outline-none  break-words"
				disabled={formState.previewing}
			/>
		</>
	);
}

export default QuestionInput;
