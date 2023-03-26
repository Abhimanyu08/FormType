import React from "react";
import { FormContextProvider } from "./FormContext";
import Modal from "@/components/Modal";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-screen w-screen flex items-center justify-center">
			<FormContextProvider>
				<Modal />
				{children}
			</FormContextProvider>
		</div>
	);
}

export default layout;
