import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";
import { useFieldArray, useFormContext } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { storage } from "../../../../firebase/clientApp";
import { IImage } from "../../../types/IProductOverview";

interface ProductImagesProps {
  index: number;
}

const ProductImages: React.FunctionComponent<ProductImagesProps> = (props) => {
  const { index } = props;
  const { control } = useFormContext();
  const {
    fields: images,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({
    control,
    name: `variants.${index}.images` as "variants.0.images",
  });

  const onImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const images = event.target.files;

    if (images && images.length > 0) {
      const imageName = images[0].name;
      const storageRef = ref(storage, "products/" + imageName);

      //   'file' comes from the Blob or File API
      await uploadBytes(storageRef, images[0]).then((snapshot) => {
        getDownloadURL(storageRef)
          .then((url) => {
            // `url` is the download URL for 'images/stars.jpg'
            const image: IImage = {
              name: imageName,
              src: url,
              alt: imageName,
            };

            appendImage(image);
          })
          .catch((error) => {
            // Handle any errors
          });
      });
    }
  };

  const onRemoveImage = (imagePosition: number, imageName: string) => {
    // Create a reference to the file to delete
    const desertRef = ref(storage, "products/" + imageName);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
        removeImage(imagePosition);
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  return (
    <>
      {/* Pictures */}
      <div className="sm:col-span-6">
        <label
          htmlFor="pictures"
          className="block text-sm font-medium text-gray-700"
        >
          Pictures
        </label>
      </div>
      {images.map((image: any, imageIndex) => {
        return (
          <div key={image.id} className="m-6 indicator">
            {/* <div className="indicator-item badge badge-secondary"></div> */}
            <HiX
              className="indicator-item inline-block w-4 h-4 mr-2 stroke-current hover:cursor-pointer"
              onClick={() => onRemoveImage(imageIndex, image.name)}
            />
            <Image
              className="grid w-32 h-32 bg-base-300 place-items-center"
              src={image.src}
              alt="Picture of the author"
              width={100}
              height={100}
            />
          </div>
        );
      })}

      {/* Add Pictures */}
      <div className="sm:col-span-6">
        <label
          htmlFor="cover-photo"
          className="block text-sm font-medium text-gray-700"
        >
          Add new pictures
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={String(index)}
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  type="file"
                  id={String(index)}
                  className="sr-only"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    onImageUpload(event);
                  }}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductImages;
