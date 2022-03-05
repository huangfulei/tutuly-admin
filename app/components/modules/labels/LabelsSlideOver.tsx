import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { addDocWithAutoID } from "../../../../firebase/firestore/client";
import { IImage } from "../../../types/IImage";
import { ILabel } from "../../../types/ILabel";
import ImageUpload from "../../elements/ImageUpload";
import SlideOverLayout from "../../layouts/SlideOverLayout";

interface LabelsSlideOverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  label: ILabel;
  onSave: (label: ILabel) => void;
  onDelete: (label: ILabel) => void;
}

const LabelsSlideOver: React.FunctionComponent<LabelsSlideOverProps> = (
  props
) => {
  const { label, open, setOpen, onSave, onDelete } = props;
  const [newLabel, setNewLabel] = useState<ILabel>({ ...label });

  //triggered when edit a different item or open
  useEffect(() => {
    setNewLabel({ ...label });
  }, [label, open]);

  return (
    <SlideOverLayout title="Label" open={open} setOpen={setOpen}>
      <div className="flex flex-col space-y-2">
        <div className="relative w-96 h-96 ">

        <ImageUpload
          limit={1}
          images={label?.image ? [label.image] : undefined}
          location="labels/"
          onUploadFinished={(image: IImage) => {
            newLabel.image = image;
            setNewLabel({ ...newLabel });
          }}
          onRemoveFinished={() => {
            delete newLabel.image;
            setNewLabel({ ...newLabel });
          }}
          />
          </div>
        <input
          type="text"
          placeholder="Name"
          defaultValue={newLabel?.name}
          onChange={(event) => {
            newLabel.name = event.target.value;
            setNewLabel({ ...newLabel });
          }}
          className="w-full input input-primary input-bordered"
        />
        <input
          type="number"
          placeholder="Priority"
          defaultValue={newLabel?.priority}
          onChange={(event) => {
            newLabel.priority = Number(event.target.value);
            setNewLabel({ ...newLabel });
          }}
          className="w-full input input-primary input-bordered"
        />
        <button
          className="btn btn-primary self-stretch"
          disabled={newLabel.name === ""}
          onClick={() => {
            onSave(newLabel);
            setOpen(false);
          }}
        >
          Save
        </button>
      </div>
    </SlideOverLayout>
  );
};

export default LabelsSlideOver;
