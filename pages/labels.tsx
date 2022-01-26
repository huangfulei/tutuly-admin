import { GetServerSideProps } from "next";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import Labels from "../app/components/modules/labels/Labels";
import { SEO } from "../app/components/templates/SEO";
import {
  addDocWithAutoID,
  getAllDocs,
  setDocWithID,
} from "../firebase/firestore/client";
import LabelsSlideOver from "./../app/components/modules/labels/LabelsSlideOver";
import { ILabel } from "./../app/types/ILabel";
import { deleteADoc } from "./../firebase/firestore/client";

const newLabel: ILabel = {
  id: uuid(),
  name: "",
};
interface LabelsProps {
  labels: ILabel[];
}

const LabelsPage: React.FunctionComponent<LabelsProps> = (props) => {
  const { labels: existLabels } = props;
  const [open, setOpen] = useState(false);
  const [labels, setLabels] = useState<ILabel[]>(existLabels);
  const [selectedLabel, setSelectedLabel] = useState<ILabel>(newLabel);

  const onRemove = async (label: ILabel) => {
    // todo: check if the label has been referenced before deleting
    await deleteADoc(`labels/${label.id}`);
    setLabels([
      ...labels.filter((existingLabel) => existingLabel.name !== label.name),
    ]);
  };

  return (
    <>
      <SEO />
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-900">All Labels</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedLabel(newLabel);
            setOpen(true);
          }}
        >
          Add New Label
        </button>
      </div>
      {/* Add and edit labels */}
      <LabelsSlideOver
        open={open}
        setOpen={setOpen}
        label={selectedLabel}
        onSave={async (label: ILabel) => {
          // setSelectedLabel(undefined);
          console.log(label);
          // Edit existing label
          if (labels.some((item) => item.id === label.id)) {
            await setDocWithID(`labels/${label.id}`, label);
            setLabels([
              ...labels.map((item) => {
                if (item.id === label.id) {
                  item = label;
                }
                return item;
              }),
            ]);
            // Add new label
          } else {
            const docRef = await addDocWithAutoID("labels/", label);
            label.id = docRef.id;
            setLabels([...labels, label]);
          }
        }}
        onDelete={async (label) => {
          await deleteADoc(`labels/${label.id}`);
          setLabels([...labels.filter((item) => item.id !== label.id)]);
        }}
      />
      <Labels
        labels={labels}
        open={open}
        setOpen={setOpen}
        setSelectedLabel={setSelectedLabel}
      />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // get all labels
  const querySnapshot = await getAllDocs("labels");
  const labels = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return {
    props: { labels }, // will be passed to the page component as props
  };
};
export default LabelsPage;
