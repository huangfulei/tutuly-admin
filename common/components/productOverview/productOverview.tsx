import { SubmitHandler, useForm } from "react-hook-form";
import { addDocWithAutoID } from "./../../../firebase/firestore/write";
import { useRouter } from "next/router";
import { useState } from "react";

interface IFormInput {
  productName: string;
  description: string;
  varName: string;
  price: number;
  stock: number;
  color: string;
  pictures: string;
  labels: string;
  addInfo: string;
}

export default function ProductOverview() {
  const router = useRouter();
  const { isNew } = router.query;
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();
  const [labels, setLabels] = useState();
  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    if (isNew) {
      // await addDocWithAutoID("productOverview", data);
      router.back();
    }
    console.log(data);
  };

  return (
    <form
      className="flex-col w-full px-2 pb-2 flex-1 relative z-0 overflow-y-auto"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Start main area*/}
      <div className=" mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* ProductName */}
        <div className="sm:col-span-6">
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
              {...register("productName", { required: true })}
              className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
          </div>
          <div className="text-red-500 text-xs italic">
            {errors.productName && "Product name is required"}
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
          <div className="flex justify-between">
            <label
              htmlFor="labels"
              className="text-sm font-medium text-gray-700"
            >
              Labels
            </label>

            {/* todo display labels */}
            <div className="dropdown dropdown-end">
              <div tabIndex={0} className="m-1 btn btn-primary">
                Add Labels
              </div>
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52"
              >
                <li>
                  <a>Item 1</a>
                </li>
                <li>
                  <a>Item 2</a>
                </li>
                <li>
                  <a>Item 3</a>
                </li>
              </ul>
            </div>
            {/* <div className="mt-1 rounded-md shadow-sm flex space-x-2">
            <input
            type="text"
            id="labels"
            autoComplete="labels"
            {...register("labels")}
            className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
            <div className="btn btn-primary">Add</div>
          </div> */}
          </div>
        </div>

        <label
          htmlFor="additional info"
          className="text-sm font-medium text-gray-700 sm:col-span-6 "
        >
          Additional Info
        </label>

        {/* Additional info item */}
        {/* Title */}
        <div className="sm:col-span-6 space-y-2">
          <label htmlFor="title" className="text-sm font-normal text-gray-700">
            Title
          </label>

          <div className="mt-1 rounded-md shadow-sm flex">
            <input
              type="text"
              id="info title"
              autoComplete="info title"
              // {...register("infoTitle")}
              className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
          </div>
          {/* Details */}
          <label
            htmlFor="about"
            className="block text-sm font-normal text-gray-700"
          >
            Details
          </label>
          <div className="mt-1">
            <textarea
              id="about"
              name="about"
              rows={3}
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
              defaultValue={""}
            />
          </div>
          <div className="w-full flex justify-end">
            <div className="btn btn-primary">Add</div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative sm:col-span-6">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">Variant</span>
          </div>
        </div>

        {/* Variant Name */}
        <div className="sm:col-span-6">
          <label
            htmlFor="variant name"
            className="text-sm font-medium text-gray-700"
          >
            Variant Name
          </label>
          <div className="mt-1 rounded-md shadow-sm">
            <input
              type="text"
              id="variant name"
              autoComplete="variant name"
              {...register("varName")}
              placeholder="Leave empty if the product has only one variant"
              className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
          </div>
        </div>

        {/* Price */}
        <div className="sm:col-span-3">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Price
          </label>
          <div className="mt-1 rounded-md shadow-sm flex">
            <input
              type="number"
              id="price"
              autoComplete="price"
              {...register("price", { required: true })}
              className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
            <div className="self-center ml-1">€</div>
          </div>
          <div className="text-red-500 text-xs italic">
            {errors.price && "Price is required"}
          </div>
        </div>

        {/* Stock */}
        <div className="sm:col-span-3">
          <label htmlFor="stock" className="text-sm font-medium text-gray-700">
            Stock
          </label>
          <div className="mt-1 rounded-md shadow-sm flex">
            <input
              type="number"
              id="stock"
              autoComplete="stock"
              {...register("stock", { required: true })}
              className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
          </div>
          <div className="text-red-500 text-xs italic">
            {errors.stock && "Stock is required"}
          </div>
        </div>

        {/* Color */}
        {/* <div className="sm:col-span-3">
          <label htmlFor="color" className="text-sm font-medium text-gray-700">
            Color
          </label>
          <div className="mt-1 rounded-md shadow-sm flex">
            <input
              type="number"
              id="color"
              autoComplete="color"
              {...register("color")}
              className=" focus:ring-indigo-500 focus:border-indigo-500 w-full min-w-0  rounded-md sm:text-sm border-gray-300"
            />
          </div>
        </div> */}

        {/* Pictures */}
        <div className="sm:col-span-6">
          <label
            htmlFor="pictures"
            className="block text-sm font-medium text-gray-700"
          >
            Pictures
          </label>
        </div>

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
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5 flex justify-between">
        <div className="btn btn-primary">Add New Variant</div>
        <div className="flex justify-end space-x-2">
          <div className="btn btn-ghost">Cancel</div>
          <button className="btn btn-primary">Save</button>
        </div>
      </div>
      {/* End main area */}
    </form>
  );
}
