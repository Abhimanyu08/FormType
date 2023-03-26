import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "../FormContext";
import { ChoiceQuestion, QuestionType } from "../QuestionInterface";

type ReactStateWrap<T> = React.Dispatch<React.SetStateAction<T>>;
type QuestionSettingsType = {
	required: boolean;
	minChoices?: number;
	maxChoices?: number;
};

function QuestionEditor() {
	const { formState, dispatch } = useContext(FormContext);
	const [questionSettings, setQuestionSettings] =
		useState<QuestionSettingsType>({
			required: false,
			minChoices: 0,
			maxChoices: 0,
		});

	useEffect(() => {
		const question = formState.questions.at(formState.questionOnShow);
		dispatch({
			type: "modify question",
			payload: {
				...question,
				...questionSettings,
			},
		});
	}, [formState.previewing, formState.questionOnShow]);
	return (
		<div className="flex flex-col h-full px-4">
			<div className="flex items-start justify-between">
				<button className="">Settings</button>
				<button className="">Logic</button>
			</div>
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
			<QuestionTypeToSettings
				{...{
					questionSettings,
					setQuestionSettings,
				}}
				question={
					formState.questions.at(formState.questionOnShow - 1) || {}
				}
			/>
		</div>
	);
}

function QuestionTypeToSettings({
	question,
	questionSettings,
	setQuestionSettings,
}: {
	question: Partial<QuestionType>;
	questionSettings: QuestionSettingsType;
	setQuestionSettings: ReactStateWrap<QuestionSettingsType>;
}) {
	switch (question.type!) {
		case "text":
		case "phone":
		case "email":
		case "number": {
			return <></>;
		}

		case "select": {
			return <label htmlFor="get-options">Add Options</label>;
		}
		case "choice": {
			return (
				<ChoiceQuestionEdtior
					{...{ questionSettings, setQuestionSettings }}
					question={question as ChoiceQuestion}
				/>
			);
		}
	}
}

function ChoiceQuestionEdtior({
	question,
	questionSettings,
	setQuestionSettings,
}: {
	question: Partial<ChoiceQuestion>;
	questionSettings: QuestionSettingsType;
	setQuestionSettings: ReactStateWrap<QuestionSettingsType>;
}) {
	return (
		<div className="flex flex-col text-sm gap-2">
			<label htmlFor="get-options">Add Options</label>
			<div className="flex gap-1">
				<label htmlFor={`minselect-${question.id}`}>
					Minimum selections :{" "}
				</label>
				<input
					type="number"
					name=""
					value={questionSettings.minChoices}
					onChange={(e) =>
						setQuestionSettings((prev) => ({
							...prev,
							minChoices: parseInt(e.target.value),
						}))
					}
					id={`minselect-${question.id}`}
					className="w-12 bg-transparent text-white focus:outline-none border-b-[1px] border-white"
				/>
			</div>
			<div className="flex gap-1">
				<label htmlFor={`maxselect-${question.id}`}>
					Maximum selections :{" "}
				</label>
				<input
					type="number"
					name=""
					id={`maxselect-${question.id}`}
					value={questionSettings.maxChoices}
					onChange={(e) =>
						setQuestionSettings((prev) => ({
							...prev,
							maxChoices: parseInt(e.target.value),
						}))
					}
					className="w-12 bg-transparent text-white focus:outline-none border-b-[1px] border-white"
				/>
			</div>
		</div>
	);
}

export default QuestionEditor;
function dispatch(arg0: { type: string; payload: any }) {
	throw new Error("Function not implemented.");
}
