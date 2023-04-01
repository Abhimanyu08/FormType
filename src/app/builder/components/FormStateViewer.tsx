import { QuestionType } from "@/types/QuestionInterface";
import { SUPABASE_FORM_TABLE } from "@/utils/constants";
import supabase from "@/utils/createSupabaseClient";
import getOrderedEntries from "@/utils/getOrderedKeys";
import { useContext, useState } from "react";
import { FormContext } from "../FormContext";
import QuestionAdder from "./QuestionAdder";
import { QuestionTable } from "@/types/Tables";
import { AiOutlineLoading } from "react-icons/ai";
import PublishedModal from "@/components/PublishedModal";

function FormStateViewer() {
	const { formState, dispatch } = useContext(FormContext);
	const [formId, setFormId] = useState<number | null>(null);
	const [uploading, setUploading] = useState(false);

	const deleteQuestion = (id: number) => {
		dispatch({
			type: "delete question",
			payload: id,
		});
	};

	const onPublish = async (questions: QuestionType) => {
		setUploading(true);
		const modifiedQuestions: QuestionType = {};
		const types = ["select", "choice"];
		const allOptions: { [key: number]: string[] } = {};
		for (let [k, v] of Object.entries(questions)) {
			let key = parseInt(k);
			if (types.includes(v.type)) {
				allOptions[key] = v.options;
				modifiedQuestions[key] = { ...v, options: [] };
			} else {
				modifiedQuestions[key] = v;
			}
		}

		const { data } = await supabase
			.from(SUPABASE_FORM_TABLE)
			.insert({
				questions,
			})
			.select<"id", QuestionTable>("id")
			.single();

		if (data) {
			setFormId(data.id);
			setUploading(false);
		}

		// if (data) {
		// 	const formId = data.at(0)?.id;
		// 	for (let key of Object.keys(allOptions)) {
		// 		let file = new File(allOptions[parseInt(key)], `${key}.txt`);
		// 		supabase.storage
		// 			.from(SUPABASE_DATA_BUCKET)
		// 			.upload(`${formId}/${key}.txt`, file, {
		// 				cacheControl: `${365 * 24 * 60 * 60}`,
		// 			});
		// 	}
		// }
	};

	return (
		<>
			{formId && <PublishedModal formId={formId} />}
			<ul className="flex flex-col  items-start p-2 gap-2 text-sm">
				{getOrderedEntries(formState.questions).map(([id, data]) => {
					return (
						<li
							onClick={() => {
								dispatch({
									type: "show question",
									payload: id,
								});
							}}
							className="flex w-full p-2 hover:bg-blue-500"
							key={id}
						>
							<span>{id}. </span>
							<span className="basis-full px-1">
								{data.content}
							</span>
							<span
								className="text-white"
								onClick={() => deleteQuestion(id)}
							>
								✖
							</span>
						</li>
					);
				})}
			</ul>
			<div className="m-1 flex gap-1 flex-col">
				<QuestionAdder />

				<label
					htmlFor="preview-form"
					className={`  rounded-sm p-2 text-sm text-black text-center w-full bg-blue-500`}
					onClick={() => {
						localStorage.setItem(
							"formData",
							JSON.stringify(formState)
						);
					}}
				>
					Preview
				</label>
				<button
					className={`  rounded-sm p-2 text-sm text-black flex items-center justify-center gap-3 text-center w-full bg-blue-500`}
					onClick={() => onPublish(formState.questions)}
				>
					<AiOutlineLoading
						className={`inline ${
							uploading ? "animate-spin" : "hidden"
						}`}
					/>
					<span>Publish</span>
				</button>
			</div>
		</>
	);
}

export default FormStateViewer;
