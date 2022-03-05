import { ReactNode } from "react";

import Loading from "../elements/Loading";
import Navbar from "../modules/nav/Navbar";

interface AppLayoutProps {
	children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
	return (
		<>
			<Navbar />
			{/* responsive for nav bra */}
			<div className="md:pl-64">
				<div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
					<Loading />
					{children}
				</div>
			</div>
		</>
	);
};
