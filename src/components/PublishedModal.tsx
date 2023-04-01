"use client";
import React, { useEffect, useState } from "react";
import { MdContentCopy } from "react-icons/md";
import { BiCheck } from "react-icons/bi";

function PublishedModal({ formId }: { formId: number }) {
	const [formCopy, setFormCopy] = useState(false);
	const [viewCopy, setViewCopy] = useState(false);

	return (
		<div
			className="absolute top-0 left-0 z-20 flex items-center justify-center  h-screen w-screen bg-black/60
      "
		>
			<div className="flex flex-col w-max p-10 gap-2 bg-black">
				<p>Form Uploaded</p>
				<p>Form id: {formId}</p>
				<p>
					Form Link -{" "}
					<p className=" inline-flex gap-2 items-center">
						<span className="bg-brand text-white p-1 rounded-sm">
							{window.location.origin}/form/{formId}{" "}
						</span>
						<button
							className="bg-brand p-2 rounded-sm"
							onClick={() => {
								navigator.clipboard.writeText(
									`${window.location.origin}/form/${formId}`
								);
								setFormCopy(true);
								setTimeout(() => setFormCopy(false), 2000);
							}}
						>
							{formCopy ? <BiCheck /> : <MdContentCopy />}
						</button>
					</p>
				</p>
				<p>
					View Form Responses -{" "}
					<p className=" inline-flex gap-2 items-center">
						<span className="bg-brand text-white p-1 rounded-sm">
							{window.location.origin}/view/{formId}{" "}
						</span>
						<button
							className="bg-brand p-2 rounded-sm"
							onClick={() => {
								navigator.clipboard.writeText(
									`${window.location.origin}/view/${formId}`
								);
								setViewCopy(true);
								setTimeout(() => setViewCopy(false), 2000);
							}}
						>
							{viewCopy ? <BiCheck /> : <MdContentCopy />}
						</button>
					</p>
				</p>
			</div>
		</div>
	);
}

export default PublishedModal;
