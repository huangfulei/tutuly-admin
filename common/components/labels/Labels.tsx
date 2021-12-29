import { useEffect, useRef, useState } from "react";
import {
  setDocWithID,
  deleteADoc,
  getAllDocs,
} from "./../../../firebase/firestore/write";
import { ILabel } from "./../../../pages/labels";

interface LabelsProps {}

const Labels: React.FunctionComponent<LabelsProps> = () => {
  const [labels, setLabels] = useState<ILabel[]>([]);
  let input = useRef<HTMLInputElement>(null);

  const onAddLabel = async () => {
    const value = input.current!.value;
    // todo: check if value already in use
    const newLabel: ILabel = { name: value };
    await setDocWithID(`labels/${value}`, newLabel);
    setLabels([...labels, newLabel]);
    // clear input value
    input.current!.value = "";
  };

  const onRemove = async (label: ILabel) => {
    // todo: check if the label has been referenced before deleting
    await deleteADoc(`labels/${label.name}`);
    setLabels([
      ...labels.filter((existingLabel) => existingLabel.name !== label.name),
    ]);
  };

  useEffect(() => {
    // set labels from DB
    getAllDocs("labels").then((docs) => {
      docs.forEach((doc) => {
        setLabels((prevLabels) => [...prevLabels, doc.data()]);
      });
    });
  }, []);
  return (
    <>
      {/* Display labels */}
      <div className="flex flex-wrap space-x-2 mb-2">
        {labels.map((label) => {
          return (
            <div key={label.name} className="badge badge-accent p-4 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-4 h-4 mr-2 stroke-current hover:cursor-pointer"
                onClick={() => onRemove(label)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
              <div className="">{label.name}</div>
            </div>
          );
        })}
      </div>

      {/* Add a new label */}
      <div className="flex space-x-2">
        <input
          ref={input}
          type="text"
          placeholder="Search"
          className="w-full input input-primary input-bordered"
        />
        <button className="btn btn-primary" onClick={onAddLabel}>
          Add
        </button>
      </div>
    </>
  );
};

export default Labels;
