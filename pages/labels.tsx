import Labels from "../app/components/modules/labels/Labels";
import { SEO } from "../app/components/templates/SEO";

interface LabelsProps {}

const LabelsPage: React.FunctionComponent<LabelsProps> = () => {
  // const saveProduct = httpsCallable(functions, "saveProduct");
  // saveProduct({ product: { name: "the best serum" } });

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
