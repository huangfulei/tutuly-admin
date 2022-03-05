import type { AppProps } from "next/app";
import Router from "next/router";
import { useEffect } from "react";

import { AppLayout } from "../app/components/layouts/AppLayout";
import useLoadingStateStore from "../app/context/loadingStateStore";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
	const { setIsLoading } = useLoadingStateStore();

	useEffect(() => {
		const start = () => {
			setIsLoading(true);
		};
		const end = () => {
			setIsLoading(false);
		};
		Router.events.on("routeChangeStart", start);
		Router.events.on("routeChangeComplete", end);
		Router.events.on("routeChangeError", end);
		return () => {
			Router.events.off("routeChangeStart", start);
			Router.events.off("routeChangeComplete", end);
			Router.events.off("routeChangeError", end);
		};
	}, []);
	return (
		<AppLayout>
			<Component {...pageProps} />
		</AppLayout>
	);
}
export default MyApp;
