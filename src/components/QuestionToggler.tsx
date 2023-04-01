import React, { Context, useContext } from "react";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { FormContext } from "../app/builder/FormContext";

function QuestionToggler({ context }: { context: Context<any> }) {
	const { dispatch } = useContext(context);
	return (
		<div className="flex absolute bottom-2 right-10 divide-x-[1px] divide-black">
			<button
				onClick={() =>
					dispatch({
						type: "prev",
					})
				}
				className="bg-blue-500 text-white p-2 rounded-l-md"
			>
				<AiFillCaretUp />
			</button>
			<button
				onClick={() =>
					dispatch({
						type: "next",
					})
				}
				className="bg-blue-500 text-white p-2 rounded-r-md"
			>
				<AiFillCaretDown />
			</button>
		</div>
	);
}

export default QuestionToggler;
