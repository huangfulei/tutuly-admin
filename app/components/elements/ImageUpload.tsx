import { TrashIcon } from "@heroicons/react/outline";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";
import { useRef, useState } from "react";
import { storage } from "../../../firebase/clientApp";
import { IImage } from "../../types/IImage";
import { classNames } from "./../../utils/classNames";

interface ImageUploadProps {
  limit: number;
  location: string;
  images?: any[];
  width?: number | string;
  height?: number | string;
  onUploadFinished: (image: IImage) => void;
  onRemoveFinished: (image: IImage, index: number) => void;
}
const ImageUpload: React.FunctionComponent<ImageUploadProps> = (props) => {
  const {
    limit,
    images,
    location,
    width,
    height,
    onUploadFinished,
    onRemoveFinished,
  } = props;
  const [uploadedImgs, setUploadedImgs] = useState<IImage[]>(images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (image: File) => {
    const imageName = image.name;
    const storageRef = ref(storage, location + imageName);

    //   'file' comes from the Blob or File API
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    // `url` is the download URL for 'images/stars.jpg'
    const newImage: IImage = {
      name: imageName,
      src: url,
      alt: imageName,
    };
    onUploadFinished(newImage);
    setUploadedImgs([...uploadedImgs, newImage]);
  };

  const removeImage = async (image: IImage, index: number) => {
    // Create a reference to the file to delete
    const desertRef = ref(storage, location + image.name);

    // Delete the file
    await deleteObject(desertRef)
      .catch(() => {})
      .finally(() => {
        setUploadedImgs([
          ...uploadedImgs.filter(
            (uploadedImg) => uploadedImg.name !== image.name
          ),
        ]);
        onRemoveFinished(image, index);
      });
  };
  return (
    <div className="flex space-x-2 h-full w-full">
      {/* Add Pictures */}
      {limit > uploadedImgs.length ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={classNames(
            width ? "w-" + width : "",
            height ? "h-" + height : "",
            "h-full w-full mt-1 px-5 py-5 border-2 border-gray-300 border-dashed rounded-md hover: cursor-pointer"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="sr-only"
            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
              const images = event.target.files;
              if (images && images.length > 0) {
                uploadImage(images[0]);
              }
            }}
          />
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      ) : undefined}

      {/* Display pictures */}
      {uploadedImgs?.map((uploadedImg, index) => (
        <div
          key={uploadedImg.name}
          className={classNames(
            width ? "w-" + width : "",
            height ? "h-" + height : "",
            "relative flex justify-center hover:opacity-70 items-center h-full w-full mt-1 px-5 py-5 rounded-md hover: cursor-pointer"
          )}
        >
          <TrashIcon
            className={
              "text-red-600 h-full w-full absolute z-10 opacity-0 hover:opacity-80 hover:cursor-pointer"
            }
            onClick={() => removeImage(uploadedImg, index)}
          />
          <Image
            className="rounded-md"
            src={uploadedImg.src}
            alt={uploadedImg.alt}
            layout="fill"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageUpload;
