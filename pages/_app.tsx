import type { AppProps } from "next/app";
import Router from "next/router";
import React from "react";
import "../styles/globals.css";
import { AppLayout } from "../app/components/layouts/AppLayout";
import Loading from "../app/components/elements/Loading";
import useLoadingStateStore from "../app/context/loadingStateStore";

function MyApp({ Component, pageProps }: AppProps) {
  const { setIsLoading } = useLoadingStateStore();

  React.useEffect(() => {
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
