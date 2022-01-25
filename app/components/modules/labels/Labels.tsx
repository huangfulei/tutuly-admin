import { Dialog, Transition } from "@headlessui/react";
import { TrashIcon, XIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import {
  addDocWithAutoID,
  deleteADoc,
  setDocWithID,
} from "../../../../firebase/firestore/client";
import { IImage } from "../../../types/IImage";
import { ILabel } from "../../../types/ILabel";
import ImageUpload from "../../elements/ImageUpload";
import SlideOverLayout from "../../layouts/SlideOverLayout";
import Loading from "./../../elements/Loading";
interface LabelsProps {
  labels: ILabel[];
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const Labels: React.FunctionComponent<LabelsProps> = (props) => {
  const { labels: existLabels, open, setOpen } = props;
  const [labels, setLabels] = useState<ILabel[]>(existLabels);
  const {
    register,
    setValue,
    unregister,
    reset,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const { isValid } = useFormState({ control });

  const onsubmit = async (data: ILabel) => {
    const docRef = await addDocWithAutoID(`labels/`, data);
    data.id = docRef.id;
    console.log(data);

    setLabels([...labels, data]);
    setOpen(false);
    reset();
  };

  const onRemove = async (label: ILabel) => {
    // todo: check if the label has been referenced before deleting
    await deleteADoc(`labels/${label.id}`);
    setLabels([
      ...labels.filter((existingLabel) => existingLabel.name !== label.name),
    ]);
  };

  useEffect(() => {
    register("name", { required: true });
  }, [register]);

  return (
    <>
      {/* Add and edit labels */}
      <SlideOverLayout title="New Label" open={open} setOpen={setOpen}>
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="relative w-96 h-96 flex flex-col space-y-2"
        >
          <ImageUpload
            limit={1}
            location="labels/"
            // width={"80"}
            // height={"80"}
            onUploadFinished={(image: IImage) => {
              register("image");
              setValue("image", image);
            }}
            onRemoveFinished={() => {
              unregister("image");
            }}
          />
          <input
            type="text"
            placeholder="Name"
            onChange={(event) => {
              setValue("name", event.target.value);
            }}
            className="w-full input input-primary input-bordered"
          />
          <button className="btn btn-primary self-stretch" type="submit">
            Add
          </button>
        </form>
      </SlideOverLayout>

      {/* Display labels */}
      <ul role="list" className="my-2 flex flex-wrap">
        {labels.map((label: ILabel) => (
          <li key={label.name} className="flex flex-col items-center mr-2 mb-5">
            <div className="relative w-32 h-32 rounded-lg bg-gray-100 md:w-64 md:h-64">
              {label.image ? (
                <ImageUpload
                  limit={1}
                  images={label.image ? [label.image] : undefined}
                  location="labels/"
                  onUploadFinished={(image: IImage) => {
                    register("image");
                    setValue("image", image);
                  }}
                  onRemoveFinished={() => {
                    onRemove(label);
                  }}
                />
              ) : (
                <TrashIcon
                  className={
                    "text-red-600 h-full w-full absolute z-10 opacity-0 hover:opacity-80 hover:cursor-pointer"
                  }
                  onClick={() => onRemove(label)}
                />
              )}
            </div>
            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
              {label.name}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Labels;
