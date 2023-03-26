"use client";
import { FormContext } from "@/app/builder/[formid]/FormContext";
import {
	ChoiceQuestion,
	QuestionType,
	SelectQuestion,
} from "@/app/builder/[formid]/QuestionInterface";
import { useContext, useEffect, useState } from "react";

function Modal() {
	const [show, setShow] = useState(false);
	const { formState, dispatch } = useContext(FormContext);
	const [optionsString, setOptionsString] = useState("");
	const [question, setQuestion] = useState<Partial<QuestionType>>();

	useEffect(() => {
		console.log("modal's useEffect called");
		const { questionOnShow, questions } = formState;
		const question = questions.at(questionOnShow - 1);
		const defaultOptions =
			(question as SelectQuestion | ChoiceQuestion)?.options || [];

		setQuestion(question);

		setOptionsString(defaultOptions.join("\n"));
	}, [formState.questionOnShow]);

	const onDone = () => {
		const options = optionsString.split("\n");

		dispatch({
			type: "modify question",
			payload: {
				...question,
				options,
			} as SelectQuestion | ChoiceQuestion,
		});
	};

	return (
		<>
			<input
				type="checkbox"
				name=""
				id="get-options"
				onChange={(e) => setShow(e.target.checked)}
				className="hidden"
			/>
			<div
				className={`flex items-center justify-center absolute bg-black/80 h-screen w-screen  z-50  ${
					show ? "" : "hidden"
				}`}
			>
				<div className="w-1/2 h-1/2 flex flex-col gap-1">
					<textarea
						className="bg-black p-2 opacity-100 text-white border-white border-2 h-full w-full"
						placeholder={`Add options` + `\n` + "One per line"}
						value={optionsString}
						onChange={(e) => setOptionsString(e.target.value)}
					/>
					<div className="flex gap-2 justify-end">
						<label
							className="w-fit p-2 bg-blue-500 text-black rounded-md"
							htmlFor="get-options"
							onClick={onDone}
						>
							Save
						</label>
						<label
							className="w-fit p-2 bg-blue-500 text-black rounded-md"
							htmlFor="get-options"
						>
							Cancel
						</label>
					</div>
				</div>
			</div>
		</>
	);
}

export default Modal;
