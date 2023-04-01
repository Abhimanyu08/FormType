"use client";
import Link from "next/link";
import React, { useState } from "react";

function ViewForm() {
	const [open, setOpen] = useState(false);
	const [formId, setFormId] = useState("");

	if (!open) {
		return (
			<button
				className="bg-brand hover:bg-blue-500 text-white w-fit px-5 py-[6px] rounded-sm
                          leading-6
                          font-bold
      
      "
				onClick={() => setOpen(true)}
			>
				View Collected Form Data
			</button>
		);
	}

	return (
		<div className="flex gap-2">
			<input
				type="text"
				placeholder="Enter Form Id"
				className="bg-transparent w-fit border-b-[1px] 
                        focus:border-b-2
                        placeholder:text-white/40
                        focus:border-white
                    text-3xl border-white/70 focus:outline-none	"
				value={formId}
				onChange={(e) => setFormId(e.target.value)}
			/>
			<Link
				href={`/view/${formId}`}
				className={`bg-brand hover:bg-blue-500 text-white w-fit px-5 py-[6px] rounded-sm
                          leading-6
                          font-bold
      
                          ${formId ? "" : "invisible"}
      `}
			>
				Go
			</Link>
		</div>
	);
}

export default ViewForm;
