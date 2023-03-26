"use client";
import { useContext } from "react";
import { FormContext } from "../FormContext";
import { QuestionOptions } from "../QuestionInterface";

function QuestionAdder() {
	const { dispatch } = useContext(FormContext);

	return (
		<select
			className="bg-blue-500 rounded-sm p-2 text-sm text-black text-center w-full"
			onChange={(e) => {
				const type = e.target.value;
				if (type) {
					dispatch({
						type: "add question",
						payload: type as typeof QuestionOptions[number],
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
