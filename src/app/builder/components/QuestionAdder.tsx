"use client";
import { useContext } from "react";
import { FormContext } from "../FormContext";
import {
	QuestionOptions,
	QuestionType,
} from "../../../types/QuestionInterface";

function QuestionAdder() {
	const { dispatch } = useContext(FormContext);

	return (
		<select
			className="bg-blue-500 rounded-sm p-2 text-sm text-black text-center w-full"
			onChange={(e) => {
				const type = e.target.value;
				if (type) {
					let payload: Partial<QuestionType[number]> = {
						type: type as typeof QuestionOptions[number],
						required: true,
					};
					if (type === "choice") {
						payload = { type, numChoices: 1, required: true };
					}
					dispatch({
						type: "add question",
						payload,
					});
				}
				e.target.value = "";
			}}
		>
			<option value="">Add question</option>
			{QuestionOptions.map((type) => {
				return (
					<option value={type} key={type}>
						{type}
					</option>
				);
			})}
		</select>
	);
}

export default QuestionAdder;
