import { GetServerSideProps } from "next";
import { useState } from "react";
import ImageUpload from "../app/components/elements/ImageUpload";
import Labels from "../app/components/modules/labels/Labels";
import { SEO } from "../app/components/templates/SEO";
import { getAllDocs } from "../firebase/firestore/client";
import SlideOverLayout from "./../app/components/layouts/SlideOverLayout";
import { ILabel } from "./../app/types/ILabel";

interface LabelsProps {
  labels: ILabel[];
}

const LabelsPage: React.FunctionComponent<LabelsProps> = (props) => {
  const { labels } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <SEO />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-900">All Labels</h1>
        <button className="btn btn-primary" onClick={() => setOpen(true)}>
          Add New Label
        </button>
      </div>

      <Labels labels={labels} open={open} setOpen={setOpen} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // get all labels
  const querySnapshot = await getAllDocs("labels");
  const labels = querySnapshot.docs.map((doc) => {
    return doc.data();
  });

  return {
    props: { labels }, // will be passed to the page component as props
  };
};
export default LabelsPage;
