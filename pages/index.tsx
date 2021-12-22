import type { NextPage } from "next";
import { SEO } from "../common/components/SEO";
import { AppLayout } from "./../modules/AppLayout";

const Home: NextPage = () => {
  return (
    <AppLayout>
      <SEO />
    </AppLayout>
  );
};

export default Home;
