import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  deleteADoc,
  setDocWithID,
} from "../../../../firebase/firestore/client";
import { IImage } from "../../../types/IImage";
import { ILabel } from "../../../types/ILabel";
import ImageUpload from "../../elements/ImageUpload";
import SlideOverLayout from "../../layouts/SlideOverLayout";
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
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onsubmit = async (data: ILabel) => {
    console.log(data);

    // const value = input.current!.value;
    // // todo: check if value already in use
    await setDocWithID(`labels/${data.name}`, data);
    setLabels([...labels, data]);
    setOpen(false);
    reset();
  };

  const onRemove = async (label: ILabel) => {
    // todo: check if the label has been referenced before deleting
    await deleteADoc(`labels/${label.name}`);
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
      <SlideOverLayout open={open} setOpen={setOpen}>
        <form
          onSubmit={handleSubmit(onsubmit)}
          className="flex flex-col space-y-2 items-center"
        >
          <ImageUpload
            limit={1}
            location="labels/"
            width={"64"}
            height={"64"}
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
        {labels.map((label) => (
          <li key={label.name} className="flex flex-col items-center mr-2 mb-5">
            <div className="relative w-32 h-32 rounded-lg bg-gray-100 md:w-64 md:h-64">
              <ImageUpload
                limit={1}
                images={label.image ? [label.image] : undefined}
                location="labels/"
                onUploadFinished={(image: IImage) => {
                  register("image");
                  setValue("image", image);
                }}
                onRemoveFinished={() => {
                  unregister("image");
                }}
              />
              <button
                type="button"
                className="absolute inset-0 focus:outline-none"
              >
                <span className="sr-only">View details for {label.name}</span>
              </button>
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
