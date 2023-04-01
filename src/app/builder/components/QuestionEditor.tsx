import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../FormContext";
import { ReactStateWrap } from "@/types/ReactWrap";
import LogicEditor from "./LogicEditor";
import { ChoiceQuestion, QuestionType } from "@/types/QuestionInterface";

type QuestionSettingsType = {
	required?: boolean;
	numChoices?: number;
};

function QuestionEditor() {
	const { formState } = useContext(FormContext);
	const [editorState, setEditorState] = useState<"settings" | "logic">(
		"settings"
	);

	return (
		<div className="flex flex-col h-full  gap-4">
			<div className="flex items-start  border-b-2 border-white">
				<button
					className="border-r-2 border-white basis-1/2 hover:bg-slate-800"
					onClick={() => setEditorState("settings")}
				>
					Settings
				</button>
				<button
					className="basis-1/2 hover:bg-slate-800"
					onClick={() => setEditorState("logic")}
				>
					Logic
				</button>
			</div>
			{editorState === "settings" ? (
				<Settings key={formState.questionOnShow} />
			) : (
				<LogicEditor key={formState.questionOnShow} />
			)}
		</div>
	);
}

function Settings() {
	const { formState, dispatch } = useContext(FormContext);
	const [questionSettings, setQuestionSettings] =
		useState<QuestionSettingsType>({});
	const [question, setQuestion] = useState<Partial<
		QuestionType[number]
	> | null>(null);

	useEffect(() => {
		const currQuestion = formState.questions[formState.questionOnShow];
		setQuestion(currQuestion || null);

		setQuestionSettings({ required: currQuestion?.required || false });
	}, []);

	const setSettings = () => {
		const questionOnShow = formState.questionOnShow;
		const question = formState.questions[questionOnShow];
		dispatch({
			type: "modify question",
			payload: {
				[questionOnShow]: {
					...question,
					...questionSettings,
				},
			},
		});
	};
	return (
		<div className="flex flex-col gap-4 px-2">
			{question ? (
				<>
					<div className="flex gap-4">
						<label htmlFor={`required-${formState.questionOnShow}`}>
							Required
						</label>

						<input
							type="checkbox"
							name=""
							id={`required-${formState.questionOnShow}`}
							checked={questionSettings["required"]}
							onChange={(e) =>
								setQuestionSettings((prev) => ({
									...prev,
									required: e.target.checked,
								}))
							}
						/>
					</div>
					{question.type === "select" && (
						<label htmlFor="get-options">Add Options</label>
					)}
					{question.type === "choice" && (
						<ChoiceQuestionEdtior
							id={formState.questionOnShow}
							{...{ questionSettings, setQuestionSettings }}
							question={question as ChoiceQuestion}
						/>
					)}
					<button
						className="bg-blue-500 text-black w-fit px-2 text-sm py-1 rounded-md self-start"
						onClick={setSettings}
					>
						Save
					</button>
				</>
			) : (
				<></>
			)}
		</div>
	);
}

function ChoiceQuestionEdtior({
	id,
	question,
	questionSettings,
	setQuestionSettings,
}: {
	id: number;
	question: Partial<ChoiceQuestion[number]>;
	questionSettings: QuestionSettingsType;
	setQuestionSettings: ReactStateWrap<QuestionSettingsType>;
}) {
	return (
		<div className="flex flex-col text-sm gap-2">
			<label htmlFor="get-options">Add Options</label>
			<div className="flex gap-1">
				<label htmlFor={`minselect-${id}`}>
					Number of selections :{" "}
				</label>
				<input
					type="number"
					name=""
					min={1}
					value={questionSettings.numChoices}
					onChange={(e) =>
						setQuestionSettings((prev) => ({
							...prev,
							numChoices: parseInt(e.target.value),
						}))
					}
					id={`minselect-${id}`}
					className="w-12 bg-transparent text-white focus:outline-none border-b-[1px] border-white"
				/>
			</div>
		</div>
	);
}

export default QuestionEditor;
