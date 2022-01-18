import { httpsCallable } from "firebase/functions";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from "react-hook-form";
import { HiX } from "react-icons/hi";
import { uuid } from "uuidv4";
import { functions, storage } from "../../../firebase/clientApp";
import { getAllDocs, setDocWithID } from "../../../firebase/firestore/client";
import { ILabel } from "../labels/ILabel";
import { IImage, IProductOverview } from "./IProductOverview";
import ProductImages from "./ProductImages";
import useLoadingStateStore from "./../../context/loadingStateStore";

interface ProductOverviewProps {
  product: IProductOverview;
}

const ProductOverview: React.FC<ProductOverviewProps> = (props) => {
  const { product } = props;
  const [newVariantIDs, setNewVariantIDs] = useState<string[]>([]);
  const { setIsLoading } = useLoadingStateStore();
  const router = useRouter();
  const priceRef = useRef(null);
  const form = useForm<IProductOverview>({
    defaultValues: { ...product, mainImage: undefined },
  });
  const {
    register,
    setValue,
    control,
    reset,
    resetField,
    formState: { errors },
    handleSubmit,
  } = form;
  const { isDirty, isValid } = useFormState({ control });
  const [labels, setLabels] = useState<ILabel[]>([]);
  const [mainImage, setMainImage] = useState<IImage | undefined>(
    product.mainImage
  );

  const {
    fields: addInfo,
    append: appendDetail,
    remove: removeDetail,
  } = useFieldArray({
    control,
    name: "details",
  });

  const {
    fields: selectedLabels,
    append: appendLabel,
    remove: removeLabel,
  } = useFieldArray({
    control,
    name: "labels",
  });

  const {
    fields: variants,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit: SubmitHandler<IProductOverview> = async (
    product: IProductOverview
  ) => {
    setIsLoading(true);
    // map labels to be string array
    if (product.labels) {
      product.labels = product.labels.map((label) => {
        return label.name;
      });
    }
    // set priority to be number
    product.priority = Number(product.priority);

    if (product.id === "new") {
      // call save product
      const addProduct = httpsCallable(functions, "addProduct");
      await addProduct(product);
    } else {
      await setDocWithID("products/" + product.id, product, true);

      if (newVariantIDs.length > 0) {
        product.variants.map(async (variant) => {
          if (newVariantIDs.some((id) => id === variant.id)) {
            const updatePrice = httpsCallable(functions, "updatePrice");
            await updatePrice({
              product,
              variant,
            });
          }
        });
      }
    }
    setIsLoading(false);

    router.back();
    reset();
  };

  useEffect(() => {
    // set labels from DB
    getAllDocs("labels").then((docs) => {
      docs.forEach((doc) => {
        setLabels((prevLabels) => [...prevLabels, doc.data() as ILabel]);
      });
    });

    // register main Image for the form(in additional to the product object)
    register("mainImage", { required: true });
    setValue("mainImage", product.mainImage);
  }, []);

  return (
    <FormProvider {...form}>
      <form
        className="flex-col w-full px-2 pb-2 flex-1 relative z-0"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Start main area*/}
        <div className=" mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* ProductName */}
          <div className="sm:col-span-5">
            <label
              htmlFor="product name"
              className="text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <div className="mt-1 rounded-md shadow-sm">
              <input
                type="text"
                id="product name"
                autoComplete="product name"
                {...register("name", { required: true })}
                className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
              />
            </div>
            <div className="text-red-500 text-xs italic">
              {errors.name && "Product name is required"}
            </div>
          </div>

          {/* Priority */}
          <div className="sm:col-span-1">
            <label
              htmlFor="priority"
              className="text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <div className="mt-1 rounded-md shadow-sm flex">
              <input
                type="number"
                id="priority"
                {...register("priority", {
                  required: true,
                })}
                className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
              />
            </div>
            <div className="text-red-500 text-xs italic">
              {errors.priority && "Priority is required"}
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-6">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <div className="mt-1">
              <textarea
                id="description"
                rows={5}
                placeholder="Product description"
                {...register("description", { required: true })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                defaultValue={""}
              />
            </div>
            <div className="text-red-500 text-xs italic">
              {errors.description && "Product description is required"}
            </div>
          </div>

          {/* Labels */}
          <div className="sm:col-span-6">
            <label
              htmlFor="labels"
              className="text-sm font-medium text-gray-700"
            >
              Labels
            </label>

            <div className="flex justify-between">
              {/* Display labels */}
              <div className="flex flex-wrap space-x-2 my-2">
                {selectedLabels.map((label, index) => {
                  return (
                    <div key={label.id} className="badge badge-accent p-4 mb-2">
                      <HiX
                        className="inline-block w-4 h-4 mr-2 stroke-current hover:cursor-pointer"
                        onClick={() => removeLabel(index)}
                      />
                      <div>{label.name}</div>
                    </div>
                  );
                })}
              </div>

              {/* Add labels */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} className="m-1 btn btn-primary">
                  Add Labels
                </div>

                <ul
                  tabIndex={0}
                  className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
                >
                  {labels.map((label) => {
                    return (
                      <li
                        key={label.name}
                        onClick={() => {
                          if (
                            !selectedLabels.some(
                              (selectedLabel) =>
                                selectedLabel.name === label.name
                            )
                          )
                            appendLabel(label);
                        }}
                      >
                        <a>{label.name}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Pictures */}
          <div className="sm:col-span-6">
            <label
              htmlFor="pictures"
              className="block text-sm font-medium text-gray-700"
            >
              Main Picture
            </label>
          </div>
          {mainImage ? (
            <div className="indicator">
              {/* <div className="indicator-item badge badge-secondary"></div> */}
              <HiX
                className="indicator-item inline-block w-4 h-4 mr-2 stroke-current hover:cursor-pointer"
                onClick={() => {
                  // Create a reference to the file to delete
                  const desertRef = ref(storage, "products/" + mainImage.name);

                  // Delete the file
                  deleteObject(desertRef)
                    .then(() => {
                      // File deleted successfully
                      // reset to default value
                      resetField("mainImage");
                      setMainImage(undefined);
                    })
                    .catch((error) => {
                      // Uh-oh, an error occurred!
                    });
                }}
              />
              <Image
                className="grid w-32 h-32 bg-base-300 place-items-center"
                src={mainImage.src}
                alt="Picture of the author"
                width={200}
                height={200}
              />
            </div>
          ) : (
            <div className="sm:col-span-6">
              {/* Add Pictures */}
              <Image
                className="grid w-32 h-32 bg-base-300 place-items-center"
                src={
                  "https://firebasestorage.googleapis.com/v0/b/tutuly-6acc2.appspot.com/o/app%2Fphoto-placeholder.png?alt=media&token=fb552a6b-bbc7-4f91-a885-4edd95f52579"
                }
                alt="Picture of the author"
                width={200}
                height={200}
              />
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700"
              >
                Add main picture
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
                      htmlFor={"mainImage"}
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload main Picture</span>
                      <input
                        type="file"
                        id={"mainImage"}
                        className="sr-only"
                        onChange={async (
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const images = event.target.files;

                          if (images && images.length > 0) {
                            const imageName = images[0].name;
                            const storageRef = ref(
                              storage,
                              "products/" + imageName
                            );

                            //   'file' comes from the Blob or File API
                            await uploadBytes(storageRef, images[0]).then(
                              (snapshot) => {
                                getDownloadURL(storageRef)
                                  .then((url) => {
                                    // `url` is the download URL for 'images/stars.jpg'
                                    const image: IImage = {
                                      name: imageName,
                                      src: url,
                                      alt: imageName,
                                    };

                                    setValue("mainImage", image, {
                                      shouldDirty: true,
                                    });
                                    setMainImage(image);
                                  })
                                  .catch((error) => {
                                    // Handle any errors
                                  });
                              }
                            );
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          )}
          <div
            className={mainImage ? "hidden" : "text-red-500 text-xs italic "}
          >
            {errors.mainImage && "Main picture is required"}
          </div>
          <label
            htmlFor="additional info"
            className="text-sm font-medium text-gray-700 sm:col-span-6 "
          >
            Additional Info
          </label>

          {/* Additional info item */}
          <div className="sm:col-span-6 space-y-2">
            <div className="flex flex-wrap">
              {addInfo.map((info, index) => {
                return (
                  <div
                    key={info.id}
                    className="card shadow-md hover:shadow-lg md:w-2/4 flex"
                  >
                    <HiX
                      className="self-end w-4 h-4 m-2 hover:cursor-pointer hover:bg-warning rounded-md"
                      onClick={() => removeDetail(index)}
                    />
                    <div className="card-body pt-0">
                      {/* Title */}
                      <label
                        htmlFor={"title" + index}
                        className="text-sm font-normal text-gray-700"
                      >
                        Title
                      </label>
                      <div className="mt-1 rounded-md shadow-sm flex">
                        <input
                          type="text"
                          id={"title" + index}
                          autoComplete={"title" + index}
                          {...register(`details.${index}.title`)}
                          className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
                        />
                      </div>
                      {/* Details */}
                      <label
                        htmlFor={"detail" + index}
                        className="block text-sm font-normal text-gray-700"
                      >
                        Details
                      </label>
                      <div className="mt-1">
                        <textarea
                          id={"detail" + index}
                          rows={3}
                          {...register(`details.${index}.detail`)}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="w-full flex justify-end">
              <div
                className="btn btn-primary"
                onClick={() => {
                  const newInfo = { id: uuid(), title: "", detail: "" };
                  appendDetail(newInfo);
                }}
              >
                Add more
              </div>
            </div>
          </div>

          {/* Variants */}
          {variants.map((variant, index) => {
            register(`variants.${index}.id`);
            return (
              <div key={variant.id} className="grid sm:col-span-6 space-y-2">
                {/* Divider */}
                <div className="relative sm:col-span-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 bg-white text-sm text-gray-500">
                      Variant
                    </span>
                  </div>
                </div>

                {/* Variant Name */}
                <div className="sm:col-span-6">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="variant name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Variant Name
                    </label>
                    <HiX
                      className="self-end w-4 h-4 m-2 hover:cursor-pointer hover:bg-warning rounded-md"
                      onClick={() => removeVariant(index)}
                    />
                  </div>
                  <div className="mt-1 rounded-md shadow-sm">
                    <input
                      type="text"
                      id="variant name"
                      autoComplete="variant name"
                      {...register(`variants.${index}.name`)}
                      placeholder="Leave empty if the product has only one variant"
                      className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
                    />
                  </div>
                </div>

                {/* Price */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="price"
                    className="text-sm font-medium text-gray-700"
                  >
                    Price
                  </label>
                  <div
                    ref={priceRef}
                    className="mt-1 rounded-md shadow-sm flex"
                  >
                    <input
                      type="number"
                      id="price"
                      autoComplete="price"
                      {...register(`variants.${index}.price`, {
                        required: true,
                        min: 1,
                      })}
                      onChange={() => {
                        const exist = newVariantIDs.some(
                          (id) => id === variant.id
                        );
                        if (!exist) {
                          setNewVariantIDs([...newVariantIDs, variant.id]);
                        }
                        // if (product.id !== "new") {
                        //   const updatePrice = httpsCallable(
                        //     functions,
                        //     "updatePrice"
                        //   );
                        //   updatePrice({
                        //     product,
                        //     variant: getValues(`variants.${index}`),
                        //   });
                        // }
                      }}
                      className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
                    />
                    <div className="self-center ml-1">€</div>
                  </div>
                  <div className="text-red-500 text-xs italic">
                    {errors.variants && errors.variants[index]
                      ? errors.variants[index].price && "Price is required"
                      : undefined}
                  </div>
                </div>

                {/* Stock */}
                <div className="sm:col-span-3">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-gray-700"
                  >
                    Stock
                  </label>
                  <div className="mt-1 rounded-md shadow-sm flex">
                    <input
                      type="number"
                      id="stock"
                      autoComplete="stock"
                      {...register(`variants.${index}.stock`, {
                        required: true,
                      })}
                      className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
                    />
                  </div>
                  <div className="text-red-500 text-xs italic">
                    {errors.variants && errors.variants[index]
                      ? errors.variants[index].stock && "Stock is required"
                      : undefined}
                  </div>
                </div>

                {/* Images */}
                <ProductImages index={index} />
              </div>
            );
          })}

          <div className="sm:col-span-6">
            <div className="pt-5 flex justify-between">
              <div
                className="btn btn-primary"
                onClick={() => {
                  const newVar = {
                    // id: uuid(),
                    name: "",
                    price: 0,
                    stock: 0,
                    images: [],
                  };
                  appendVariant(newVar);
                  // setNewVariants([...newVariants, newVar]);
                }}
              >
                Add More Variant
              </div>
              <div className="flex justify-end space-x-2">
                <div className="btn btn-ghost" onClick={() => router.back()}>
                  Cancel
                </div>
                <input
                  type="submit"
                  className="btn btn-primary"
                  disabled={!isDirty}
                ></input>
              </div>
            </div>
          </div>
        </div>
        {/* End main area */}
      </form>
    </FormProvider>
  );
};

export default ProductOverview;
