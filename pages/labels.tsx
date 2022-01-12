import { httpsCallable } from "firebase/functions";
import { SEO } from "../app/components/SEO";
import { functions } from "../firebase/clientApp";
import Labels from "../app/components/labels/Labels";

interface LabelsProps {}

const LabelsPage: React.FunctionComponent<LabelsProps> = () => {
  const helloWorld = httpsCallable(functions, "helloWorld");
  const saveProduct = httpsCallable(functions, "saveProduct");

  helloWorld();

  saveProduct({ name: "the best serum" });

  return (
    <>
      <SEO />
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-900">All Labels</h1>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Add A New Label</span>
        </label>
      </div>
      <Labels />
    </>
  );
};

export default LabelsPage;
