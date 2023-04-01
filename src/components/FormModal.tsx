"use client";
import { FormContext } from "@/app/builder/FormContext";
import QuestionToggler from "@/components/QuestionToggler";
import getOrderedEntries from "@/utils/getOrderedKeys";
import { useContext } from "react";
import { QuestionPreview } from "./QuestionPreview";

function FormModal() {
	const { formState, dispatch } = useContext(FormContext);

	return (
		<>
			<input
				type="checkbox"
				name=""
				id="preview-form"
				onChange={(e) => {
					dispatch({
						type: "toggle preview",
					});
				}}
				className="hidden"
			/>
			<div
				className={`flex items-center justify-center absolute bg-black h-screen w-screen  z-50  ${
					formState.previewing ? "" : "hidden"
				}`}
			>
				<div className="w-full h-full overflow-y-clip">
					{formState.previewing &&
						getOrderedEntries(formState.questions).map(
							([id, question], _, arr) => {
								return (
									<QuestionPreview
										{...{
											id,
											question,
										}}
										last={id === arr.length - 1}
										questionOnShow={
											formState.questionOnShow
										}
										context={FormContext}
										responses={formState.responses}
										key={id}
									/>
								);
							}
						)}
				</div>
				<label
					htmlFor="preview-form"
					className="absolute right-0 top-0"
				>
					Close
				</label>
				{/* <QuestionToggler context={FormContext} /> */}
			</div>
		</>
	);
}

export default FormModal;
