import React, { useContext, useEffect, useState } from "react";
import {
	ChoiceQuestion,
	QuestionType,
	ResponseType,
	SelectQuestion,
} from "../QuestionInterface";
import { FormContext } from "../FormContext";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

function QuestionResponse({ question }: { question: Partial<QuestionType> }) {
	const { formState } = React.useContext(FormContext);

	const { dispatch } = useContext(FormContext);
	const handleSubmit = () => {
		if (formState.previewing) {
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
				payload: question.id! + 1,
			});
		}
	};
	return (
		<>
			{/* <input
				id={`response-${question.id}`}
				type={question.type}
				className="bg-transparent text-2xl text-white focus:outline-none border-b-[1px] border-white"
				placeholder="name@example.com"
				disabled={!formState.previewing}
			/> */}
			<QuestionTypeToResponse question={question} />
			<button
				className="bg-blue-500 text-white w-fit px-5 py-1 rounded-md self-start"
				onClick={handleSubmit}
			>
				Ok
			</button>
		</>
	);
}

function QuestionTypeToResponse({
	question,
}: {
	question: Partial<QuestionType>;
}) {
	const type = question.type!;
	const { formState } = useContext(FormContext);

	switch (type) {
		case "text":
		case "email":
		case "phone":
		case "number": {
			return (
				<input
					id={`response-${question.id}`}
					type={type === "phone" ? "text" : type}
					className="bg-transparent w-full text-2xl text-white focus:outline-none border-b-[1px] border-white"
					placeholder={
						type === "email"
							? "username@example.com"
							: "Enter your answer here"
					}
					disabled={!formState.previewing}
				/>
			);
			break;
		}
		case "select": {
			return (
				<SelectResponse
					question={question as Partial<SelectQuestion>}
				/>
			);
			break;
		}
		case "choice": {
			return (
				<ChoiceResponse
					question={question as Partial<ChoiceQuestion>}
				/>
			);
			break;
		}
	}
}

function ChoiceResponse({ question }: { question: Partial<ChoiceQuestion> }) {
	return (
		<div className="relative w-full">
			<ul className="flex flex-col bg-black z-10 absolute h-52 overflow-auto w-full">
				{(question.options || []).map((v) => (
					<li key={v}>{v}</li>
				))}
			</ul>
		</div>
	);
}

function SelectResponse({ question }: { question: Partial<SelectQuestion> }) {
	const [showOptionsList, setShowOptionsList] = useState(false);
	const [typedValue, setTypedValue] = useState("");
	const [optionsToShow, setOptionsToShow] = useState(question.options || []);

	useEffect(() => {
		if (typedValue !== "" && !showOptionsList) setShowOptionsList(true);
		if (typedValue === "") {
			setShowOptionsList(false);
			setOptionsToShow(question.options || []);
			return;
		}
		const newOptions = optionsToShow.filter((o) => o.includes(typedValue));
		setOptionsToShow(newOptions);
	}, [typedValue, question.options]);

	return (
		<div className="flex flex-col w-full relative">
			<input
				type="text"
				name=""
				id=""
				className="bg-transparent border-b-[1px] text-2xl border-white focus:outline-none"
				placeholder="Type or select an option"
				value={typedValue}
				onChange={(e) => setTypedValue(e.target.value)}
			/>
			<button
				className="absolute right-0 top-2"
				onClick={() => setShowOptionsList((prev) => !prev)}
			>
				{showOptionsList ? <AiFillCaretUp /> : <AiFillCaretDown />}
			</button>
			<div className={`relative ${showOptionsList ? "" : "hidden"}`}>
				<ul className="absolute h-52 overflow-auto w-full bg-black z-10">
					{optionsToShow.map((v) => {
						return <li key={v}>{v}</li>;
					})}
				</ul>
			</div>
		</div>
	);
}

export default QuestionResponse;
