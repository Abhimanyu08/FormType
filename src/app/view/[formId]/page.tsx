import { AnswerType } from "@/types/QuestionInterface";
import { QuestionTable, ResponseTable } from "@/types/Tables";
import {
	SUPABASE_FORM_TABLE,
	SUPABASE_RESPONSE_TABLE,
} from "@/utils/constants";
import supabase from "@/utils/createSupabaseClient";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";

async function View({ params }: { params: NextParsedUrlQuery }) {
	const { data: responseData } = await supabase
		.from(SUPABASE_RESPONSE_TABLE)
		.select<"*", ResponseTable>("*")
		.eq("form", parseInt(params.formId as string))
		.limit(10);

	const { data: questionData } = await supabase
		.from(SUPABASE_FORM_TABLE)
		.select<"*", QuestionTable>("*")
		.eq("id", params.formId)
		.single();

	const questionToAnswers: { [key: string]: AnswerType[] } = {};
	const rowLength = responseData?.length || 1;

	if (responseData && questionData) {
		for (let response of responseData) {
			for (let [qid, answer] of Object.entries(response.response_data)) {
				let questionText =
					questionData.questions[parseInt(qid)].content;
				let prevAnswers = questionToAnswers[questionText] || [];
				questionToAnswers[questionText] = [...prevAnswers, answer];
			}
		}
	}

	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen">
			<table className="table-auto border-spacing-5">
				<caption className="caption-top">
					Response Data for formId: {params.formId}. This page
					revalidates every 60 seconds
				</caption>
				<thead>
					<tr>
						{Object.keys(questionToAnswers || {}).map((k) => (
							<th
								key={k}
								className="border-2 bg-brand text-black"
							>
								{k}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({ length: rowLength }, (_, i) => i).map(
						(row) => {
							return (
								<tr key={row}>
									{Object.keys(questionToAnswers || {}).map(
										(question) => {
											const answer = (questionToAnswers ||
												{})[question]?.at(row);
											return (
												<td
													key={answer?.toString()}
													className="border-2 p-1"
												>
													{answer?.toString()}
												</td>
											);
										}
									)}
								</tr>
							);
						}
					)}
				</tbody>
			</table>
		</div>
	);
}

export default View;
export const revalidate = 60;
