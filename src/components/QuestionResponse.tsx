import React, {
	Context,
	Dispatch,
	useContext,
	useEffect,
	useState,
} from "react";

import { ReactStateWrap } from "@/types/ReactWrap";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import {
	AnswerType,
	ChoiceQuestion,
	QuestionType,
	SelectQuestion,
} from "../types/QuestionInterface";
import CountrySelect from "../app/builder/components/CountrySelect";

const alphabet = "abcdefghijklmnopqrstuvwxyz";
function QuestionResponse({
	id,
	question,
	answer,
	context,
	last = false,
}: {
	id: number;
	question: Partial<QuestionType[number]>;
	answer?: AnswerType[number];
	context: Context<any>;
	last?: boolean;
}) {
	const [response, setResponse] = useState<AnswerType[number]>(answer || "");
	const [error, setError] = useState("");
	const { dispatch } = useContext(context);

	useEffect(() => {
		if (response !== "" && error) {
			setError("");
		}
	}, [response]);

	const handleSubmit = (response: AnswerType[number]) => {
		if (question.required) {
			if (typeof response === "string") {
				if (!response) {
					setError("Please fill this in");
					return;
				}
			}
			if (question.type === "choice") {
				const min = (question as ChoiceQuestion[number]).numChoices;
				const rlength = (response as string[]).length;

				if (rlength < min) {
					setError(`Select at least ${min - rlength} more`);
					return;
				}
			}
		}

		dispatch({
			type: "next",
			payload: { [id]: response },
		});
		if (last) {
			dispatch({
				type: "submit",
			});
		}
	};
	return (
		<div className="w-full flex flex-col gap-3">
			<QuestionTypeToResponse
				id={id}
				question={question}
				{...{ response, setResponse, handleSubmit }}
			/>
			{error ? (
				<p
					className="px-2 py-1 self-start bg-error text-textError rounded-sm
				"
				>
					{error}
				</p>
			) : (
				<div className="flex self-start items-center gap-4">
					<button
						className="bg-brand hover:bg-blue-500 text-white w-fit px-5 py-[6px] rounded-sm
					leading-6
					font-bold
					 "
						onClick={() => handleSubmit(response)}
						id={question.type === "choice" ? `response-${id}` : ""}
						onKeyDown={(e) => {
							console.log("hu");
							if (e.key === "Enter") {
								handleSubmit(response);
							}
						}}
					>
						{last ? "Submit" : "OK"}
					</button>
					<span className="text-xs font-semibold">
						press Enter ↵{" "}
					</span>
				</div>
			)}
		</div>
	);
}

function QuestionTypeToResponse({
	id,
	question,
	response,
	setResponse,
	handleSubmit,
}: {
	id: number;
	question: Partial<QuestionType[number]>;
	response: AnswerType[number];
	setResponse: ReactStateWrap<AnswerType[number]>;
	handleSubmit: (response: AnswerType[number]) => void;
}) {
	const type = question.type!;

	switch (type) {
		case "text":
		case "email":
		case "number": {
			return (
				<input
					id={`response-${id}`}
					type={type}
					className="bg-transparent w-full border-b-[1px] 
					focus:border-b-2
					placeholder:text-white/40
					focus:border-white
				text-3xl border-white/70 focus:outline-none	"
					placeholder={
						type === "email"
							? "username@example.com"
							: "Enter your answer here"
					}
					value={response as string}
					onChange={(e) => setResponse(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSubmit(response);
						}
					}}
				/>
			);
		}
		case "phone": {
			return (
				<PhoneResponse
					{...{ id, response, setResponse, handleSubmit }}
				/>
			);
		}
		case "select": {
			return (
				<SelectResponse
					question={question as Partial<SelectQuestion[number]>}
					{...{ id, response, setResponse, handleSubmit }}
				/>
			);
		}
		case "choice": {
			return (
				<ChoiceResponse
					question={question as Partial<ChoiceQuestion[number]>}
					{...{ id, response, setResponse, handleSubmit }}
				/>
			);
		}
	}
}

function PhoneResponse({
	id,
	response,
	handleSubmit,
	setResponse,
}: {
	id: number;
	response: AnswerType[number];
	handleSubmit: (response: AnswerType[number]) => void;
	setResponse: ReactStateWrap<AnswerType[number]>;
}) {
	const [countryCode, setCountryCode] = useState("");
	const [number, setNumber] = useState("");
	const PureCountrySelect = React.memo(CountrySelect);

	useEffect(() => {
		if (countryCode === "" && number === "" && response) {
			const [code, num] = (response as string).split("-");
			console.log(code, num);
			setCountryCode(code);
			setNumber(num);
		}
	}, [response]);

	useEffect(() => {
		if (number !== "") {
			setResponse(`${countryCode || "91"}-${number}`);
		}
	}, [countryCode, number]);

	return (
		<div className="flex w-full gap-2">
			<PureCountrySelect {...{ countryCode, setCountryCode }} />
			<input
				type="tel"
				name=""
				id={`response-${id}`}
				placeholder="1234567890"
				pattern="[0-9]{10}"
				className="bg-transparent basis-1/2 border-b-[1px] 
					focus:border-b-2
					placeholder:text-white/40
					focus:border-white
					tracking-wide
				text-3xl border-white/70 focus:outline-none	"
				value={number}
				onChange={(e) => setNumber(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSubmit(response);
					}
				}}
			/>
		</div>
	);
}

function ChoiceResponse({
	id,
	question,
	response,
	handleSubmit,
	setResponse,
}: {
	id: number;
	question: Partial<ChoiceQuestion[number]>;
	response: AnswerType[number];
	handleSubmit: (response: AnswerType[number]) => void;
	setResponse: ReactStateWrap<AnswerType[number]>;
}) {
	let { numChoices, options } = question;
	const [remaining, setRemaining] = useState(numChoices || 0);

	useEffect(() => {
		setRemaining((numChoices || 1) - (response as string[]).length);
	}, [response, numChoices]);

	const onOptionClick = (selection: string) => {
		setResponse((prev) => {
			let previous = prev as string[];
			if (previous.includes(selection)) {
				previous = previous.filter((s) => s !== selection);
				return previous;
			}
			if (previous.length == (numChoices || 1) - 1) {
				const resp = [...previous, selection];
				handleSubmit(resp);
			}
			if (previous.length < (numChoices || 1)) {
				const set = new Set([...previous, selection]);
				return Array.from(set);
			}
			return prev;
		});
	};

	return (
		<div className="w-full relative">
			<p
				className={`text-xs pb-3 ${
					(numChoices || 1) > 1 && remaining > 0 ? "" : "invisible"
				}`}
			>
				Choose {remaining} {remaining < (numChoices || 1) ? "more" : ""}
			</p>
			<ul className="flex flex-col bg-black z-10 gap-2 overflow-auto w-max">
				{(options || []).map((v, i) => (
					<li
						key={v}
						onClick={() => onOptionClick(v)}
						className={`text-xl flex gap-2 items-center bg-options border-white
									 rounded-md px-2 py-2
									hover:bg-hoverOptions 
									${(response as string[]).includes(v) ? "border-2" : "border-[1px]"}
								`}
					>
						<span
							className={`
							
									${
										(response as string[]).includes(v)
											? "bg-white text-black"
											: "bg-black text-white"
									}
							uppercase border-white font-semibold  border-[1px] px-2  text-base 

							`}
						>
							{alphabet.at(i)}
						</span>
						<span className="basis-full pr-8">{v}</span>
						<span
							className={`${
								(response as string[]).includes(v)
									? ""
									: "invisible"
							}`}
						>
							✓
						</span>
					</li>
				))}
			</ul>
		</div>
	);
}

function SelectResponse({
	id,
	question,
	response,
	handleSubmit,
	setResponse,
}: {
	id: number;
	question: Partial<SelectQuestion[number]>;
	handleSubmit: (response: AnswerType[number]) => void;
	response: AnswerType[number];
	setResponse: ReactStateWrap<AnswerType[number]>;
}) {
	const [showOptionsList, setShowOptionsList] = useState(false);
	const [optionsToShow, setOptionsToShow] = useState(question.options || []);

	useEffect(() => {
		if (response) {
			const newOptions = question.options?.filter((o) =>
				o.toLowerCase().includes((response as string).toLowerCase())
			);
			setOptionsToShow(newOptions || []);
			setShowOptionsList(true);
			return;
		}
		setOptionsToShow(question.options as string[]);
		setShowOptionsList(false);
	}, [response, question.options]);

	return (
		<div className="flex flex-col w-full relative">
			<input
				type="text"
				name=""
				id={`response-${id}`}
				className="bg-transparent border-b-[1px] 
					focus:border-b-2
					placeholder:text-white/40
					focus:border-white
				text-3xl border-white/70 focus:outline-none"
				placeholder="Type or select an option"
				value={response}
				onChange={(e) => setResponse(e.target.value)}
				onFocus={() => {
					setShowOptionsList(true);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSubmit(response);
					}
				}}
			/>
			<button
				className="absolute right-0 top-2"
				onClick={() => {
					if (response) {
						setResponse("");
						return;
					}
					setShowOptionsList((prev) => !prev);
				}}
			>
				{response === "" ? (
					showOptionsList ? (
						<AiFillCaretUp />
					) : (
						<AiFillCaretDown />
					)
				) : (
					<RxCross2 />
				)}
			</button>
			<div className={`relative ${showOptionsList ? "" : "hidden"}`}>
				<ul className="absolute h-52 overflow-auto w-full bg-black z-10 flex flex-col gap-1">
					{(optionsToShow || []).map((v) => {
						return (
							<li
								key={v}
								onClick={() => {
									setShowOptionsList(false);
									handleSubmit(v);
								}}
								className="text-xl bg-options border-white
									border-[1px] rounded-md px-2 py-1
									hover:bg-hoverOptions
								"
							>
								{v}
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}

export default QuestionResponse;
