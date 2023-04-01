import { SUPABASE_FORM_TABLE } from "@/utils/constants";
import supabase from "@/utils/createSupabaseClient";
import { NextParsedUrlQuery } from "next/dist/server/request-meta";
import React from "react";
import FormContextProvider from "../FormContext";
import SlideShow from "../SlideShow";

async function Form({ params }: { params: NextParsedUrlQuery }) {
	const { data } = await supabase
		.from(SUPABASE_FORM_TABLE)
		.select("questions")
		.eq("id", params.formId);

	return (
		<FormContextProvider
			questions={data?.at(0)?.questions}
			formId={parseInt(params.formId as string)}
		>
			<SlideShow />
		</FormContextProvider>
	);
}

export default Form;
