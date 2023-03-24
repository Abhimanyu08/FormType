"use client";
import React, { useContext } from "react";
import { FormContext } from "../FormContext";
import { QuestionType } from "../QuestionInterface";

function QuestionSelector() {
	const { dispatch } = useContext(FormContext);

	return (
		<div>
			Add a questiong with respone type{" "}
			<select
				className="bg-transparent text-white"
				onChange={(e) => {
					const type = e.target.value;
					dispatch({
						type: "add question",
						payload: {
							id: 0,
							type,
							content:
								"Press / to refer to previous question responses",
						} as QuestionType,
					});
				}}
			>
				<option value="none">None</option>
				<option value="text">text</option>
				<option value="email">email</option>
				<option value="phone">phone number</option>
			</select>{" "}
		</div>
	);
}

export default QuestionSelector;
