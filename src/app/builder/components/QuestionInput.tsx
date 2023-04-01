import React, { useContext, useEffect, useRef, useState } from "react";
import { FormContext } from "../FormContext";
import getOrderedEntries from "@/utils/getOrderedKeys";
import { QuestionType } from "@/types/QuestionInterface";

function QuestionInput({
	id,
	question,
}: {
	id: number;
	question: Partial<QuestionType[number]>;
}) {
	const { formState, dispatch } = useContext(FormContext);

	const [showQuestions, setShowQuestions] = useState(false);

	const [questionText, setQuestionText] = useState(question.content);
	const [descriptionText, setDescriptionText] = useState(
		question.description
	);

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
				[id]: {
					...question,
					content: questionText,
					description: descriptionText,
				},
			} as QuestionType,
		});
	}, [formState.previewing, formState.questionOnShow]);

	return (
		<>
			<div className="w-full flex items-center gap-2 relative">
				{" "}
				<span className="text-sm">{id}→ </span>
				<input
					id={`question-${id}`}
					type="text"
					placeholder={
						"Press / to refer to responses of previous questions"
					}
					className={`bg-transparent text-2xl   focus:outline-none basis-full break-words`}
					onKeyDown={handleSlash}
					disabled={formState.previewing}
					value={questionText}
					onChange={(e) => setQuestionText(e.target.value)}
				/>
				<select
					id="question-referrer"
					className={`flex flex-col w-44 text-xs bg-blue-500 text-white font-semibold border-2 rounded-md absolute right-0 divide-y-2 ${
						showQuestions ? "" : "invisible"
					}`}
					onChange={(e) => {
						setShowQuestions(false);
						document.getElementById(`questions-${id}`)?.focus();
						setQuestionText((prev) => prev + e.target.value);
					}}
				>
					<option value="None">Select a question</option>
					{getOrderedEntries(formState.questions).map(
						([qid, data]) => {
							if ((qid || 0) < id!) {
								return (
									<option
										key={qid}
										value={qid}
										className="truncate break-words px-2 py-2 hover:bg-cyan-400 hover:text-black"
									>
										{data?.content}
									</option>
								);
							}
						}
					)}
				</select>
			</div>

			<textarea
				id={`description-${id}`}
				placeholder={"Enter description (Optional)"}
				className="bg-transparent text-lg w-full focus:outline-none  break-words"
				disabled={formState.previewing}
				value={descriptionText}
				onChange={(e) => setDescriptionText(e.target.value)}
			/>
		</>
	);
}

export default QuestionInput;
