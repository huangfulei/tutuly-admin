import { RawDraftContentState, convertFromRaw, convertToRaw } from "draft-js";
import { httpsCallable } from "firebase/functions";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { EditorProps } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { FormProvider, SubmitHandler, useFieldArray, useForm, useFormState } from "react-hook-form";
import { HiX } from "react-icons/hi";
import { v4 as uuid } from "uuid";

import { functions } from "../../../../firebase/clientApp";
import { getAllDocs, setDocWithID } from "../../../../firebase/firestore/client";
import useLoadingStateStore from "../../../context/loadingStateStore";
import { IImage } from "../../../types/IImage";
import { ILabel } from "../../../types/ILabel";
import { INavItem } from "../../../types/INavItem";
import { IProductOverview, IVariant } from "../../../types/IProductOverview";
import ImageUpload from "../../elements/ImageUpload";

import Combobox from "./../../elements/Combobox";
import ProductImages from "./ProductImages";
const Editor = dynamic<EditorProps>(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });

interface ProductOverviewProps {
	product: IProductOverview;
}

const ProductOverview: React.FC<ProductOverviewProps> = props => {
	const { product } = props;
	const [newVariants, setNewVariants] = useState<IVariant[]>([]);
	const [newOnSalePrices, setNewOnSalePrices] = useState<IVariant[]>([]);
	const { setIsLoading } = useLoadingStateStore();
	const router = useRouter();
	const form = useForm<IProductOverview>({
		defaultValues: { ...product, mainImage: undefined },
	});
	const {
		register,
		setValue,
		getValues,
		watch,
		control,
		reset,
		resetField,
		formState: { errors },
		handleSubmit,
	} = form;
	const { isDirty } = useFormState({ control });
	const [labels, setLabels] = useState<ILabel[]>([]);
	const [lvl0Nav, setLvl0Nav] = useState<string[]>([]);
	const [lvl1Nav, setLvl1Nav] = useState<string[]>([]);
	const [lvl2Nav, setLvl2Nav] = useState<string[]>([]);
	const [filteredLvl1Nav, setFilteredLvl1Nav] = useState<string[]>([]);
	const [filteredLvl2Nav, setfilteredLvl2Nav] = useState<string[]>([]);
	const [mainImage, setMainImage] = useState<IImage | undefined>(product.mainImage);

	const {
		fields: addInfo,
		append: appendDetail,
		remove: removeDetail,
	} = useFieldArray({
		control,
		name: "details",
	});

	const {
		fields: variants,
		append: appendVariant,
		remove: removeVariant,
	} = useFieldArray({
		control,
		name: "variants",
	});

	const onSubmit: SubmitHandler<IProductOverview> = async (product: IProductOverview) => {
		// console.log(product);
		// return;
		setIsLoading(true);
		// set priority to be number
		product.priority = Number(product.priority);
		// set value to be number
		product.variants.map(variant => {
			variant.price = Number(variant.price);
			if (variant.onSalePrice?.id) {
				variant.onSalePrice.value = Number(variant.onSalePrice.value);
			}
			return variant;
		});

		// set price
		product.price = Math.min(
			...product.variants
				.map(variant => variant.price)
				.concat(
					product.variants.map(variant => {
						if (variant.onSalePrice?.id) {
							return Number(variant.onSalePrice?.value);
						} else {
							return 9999999;
						}
					})
				)
		);

		// save new product
		if (product.id === "new") {
			// call save product
			const addProduct = httpsCallable(functions, "addProduct");
			await addProduct(product);
		} else {
			// update existing product
			if (newVariants.length > 0 || newOnSalePrices.length > 0) {
				const updatePrice = httpsCallable(functions, "updatePrice");
				await updatePrice({
					product,
					variants: newVariants,
					onSalePrices: newOnSalePrices,
				});
				setNewVariants([]);
				setNewOnSalePrices([]);
			} else {
				await setDocWithID("products/" + product.id, product);
			}
		}
		setIsLoading(false);
		router.back();
		reset();
	};

	// draft js logic
	// get initial
	const content = {
		entityMap: {},
		blocks: [
			{
				key: "637gr",
				text: "",
				type: "unstyled",
				depth: 0,
				inlineStyleRanges: [],
				entityRanges: [],
				data: {},
			},
		],
	};

	useEffect(() => {
		// set labels from DB
		getAllDocs("labels").then(snap => {
			const labels = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as ILabel));
			setLabels(labels);
		});

		// set navItems
		getAllDocs("navItems").then(snap => {
			const items = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as INavItem));
			const lvl0Items: string[] = [];
			const lvl1Items: string[] = [];
			const lvl2Items: string[] = [];
			items.forEach(item => {
				if (!item.isPage) {
					lvl0Items.push(item.name);
					// add features
					if (item.features) {
						item.features.forEach(feature => {
							if (lvl1Items.some(existItem => existItem.includes(item.name + " > " + feature.name))) {
								return;
							}
							lvl1Items.push(item.name + " > " + feature.name);
						});
					}

					// add nav items
					if (item.navItems) {
						item.navItems.forEach(lvl1 => {
							if (lvl1Items.some(existItem => existItem.includes(item.name + " > " + lvl1.name))) {
								return;
							}
							lvl1Items.push(item.name + " > " + lvl1.name);
							if (lvl1.navItems) {
								lvl1.navItems.forEach(lvl2 => {
									if (
										lvl2Items.some(existItem => existItem.includes(item.name + " > " + lvl1.name + " > " + lvl2.name))
									) {
										return;
									}
									lvl2Items.push(item.name + " > " + lvl1.name + " > " + lvl2.name);
								});
							}
						});
					}
				}
			});
			setLvl0Nav(lvl0Items);
			setLvl1Nav(lvl1Items);
			setLvl2Nav(lvl2Items);
		});

		// register main Image for the form(in additional to the product object)
		register("mainImage", { required: true, value: product.mainImage });
	}, []);

	return (
		<FormProvider {...form}>
			<form className="flex-col w-full px-2 pb-2 flex-1 relative z-0" onSubmit={handleSubmit(onSubmit)}>
				{/* Start main area*/}
				<div className=" mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
					{/* ProductName */}
					<div className="sm:col-span-5">
						<label htmlFor="product name" className="text-sm font-medium text-gray-700">
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
						<div className="text-red-500 text-xs italic">{errors.name && "Product name is required"}</div>
					</div>

					{/* Priority */}
					<div className="sm:col-span-1">
						<label htmlFor="priority" className="text-sm font-medium text-gray-700">
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
						<div className="text-red-500 text-xs italic">{errors.priority && "Priority is required"}</div>
					</div>

					{/* Description */}
					<div className="sm:col-span-6">
						<label htmlFor="description" className="block text-sm font-medium text-gray-700">
							Description
						</label>
						<div className="mt-1">
							{/* <textarea
                id="description"
                rows={5}
                placeholder="Product description"
                {...register("description", { required: true })}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                defaultValue={""}
              /> */}
							<Editor
								defaultContentState={convertToRaw(convertFromRaw(product.description))}
								toolbarClassName="toolbarClassName"
								wrapperClassName="wrapperClassName"
								editorClassName="editorClassName"
								onContentStateChange={content => {
									register("description", { required: true });
									setValue("description", content, { shouldDirty: true });
								}}
							/>
						</div>
						<div className="text-red-500 text-xs italic">{errors.description && "Product description is required"}</div>
					</div>

					{/* Labels */}
					<div className="sm:col-span-6">
						<label htmlFor="labels" className="text-sm font-medium text-gray-700">
							Labels
						</label>

						<div className="flex justify-between">
							{/* Display labels */}
							<div className="flex flex-wrap space-x-2 my-2">
								{(watch("labels") || []).map(label => {
									return (
										<div key={label} className="badge badge-accent p-4 mb-2">
											<HiX
												className="inline-block w-4 h-4 mr-2 stroke-current hover:cursor-pointer"
												onClick={() => {
													const existingLabels = getValues("labels");
													if (existingLabels && existingLabels.some(existing => existing === label)) {
														setValue(
															"labels",
															existingLabels.filter(existing => existing !== label),
															{
																shouldDirty: true,
															}
														);
													}
												}}
											/>
											<div>{label}</div>
										</div>
									);
								})}
							</div>

							{/* Add labels */}
							<div className="dropdown dropdown-end">
								<div tabIndex={0} className="m-1 btn btn-primary">
									Add Labels
								</div>

								<ul tabIndex={0} className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
									{labels.map(label => {
										return (
											<li
												key={label.id}
												onClick={() => {
													const existingLabels = getValues("labels");

													// add label only when not existing
													if (existingLabels && !existingLabels.some(existing => existing === label.name)) {
														existingLabels.push(label.name);
														setValue("labels", existingLabels, {
															shouldDirty: true,
														});
													} else {
														setValue("labels", existingLabels, {
															shouldDirty: true,
														});
													}
												}}>
												<a>{label.name}</a>
											</li>
										);
									})}
								</ul>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<div className="sm:col-span-6">
						<label htmlFor="navigation" className="text-sm font-medium text-gray-700">
							Navigation
						</label>
					</div>

					<div className="sm:col-span-2">
						<Combobox
							defaultValue={product.categories?.lvl0}
							options={lvl0Nav}
							label={"level 0"}
							onSelect={(value: string) => {
								register("categories.lvl0");
								// set value for product
								setValue("categories.lvl0", value, { shouldDirty: true });
								// refine level 1 items
								setFilteredLvl1Nav(lvl1Nav.filter(item => item.includes(value)));
							}}
						/>
					</div>
					<div className="sm:col-span-2">
						<Combobox
							defaultValue={product.categories?.lvl1}
							options={filteredLvl1Nav}
							label={"level 1"}
							onSelect={(value: string) => {
								register("categories.lvl1");
								setValue("categories.lvl1", value, { shouldDirty: true });
								setfilteredLvl2Nav(lvl2Nav.filter(item => item.includes(value)));
							}}
						/>
					</div>
					<div className="sm:col-span-2">
						<Combobox
							defaultValue={product.categories?.lvl2}
							options={filteredLvl2Nav}
							label={"level 2"}
							onSelect={(value: string) => {
								register("categories.lvl2");
								setValue("categories.lvl2", value, { shouldDirty: true });
							}}
						/>
					</div>
					{/* </div> */}

					{/* Pictures */}
					<div className="sm:col-span-6 relative w-32 h-32">
						{/* <label
              htmlFor="pictures"
              className="block text-sm font-medium text-gray-700"
            >
              Main Picture
            </label> */}

						<ImageUpload
							aspect={1}
							limit={1}
							location={"products/"}
							images={mainImage ? [mainImage] : undefined}
							onUploadFinished={image => {
								setValue("mainImage", image, {
									shouldDirty: true,
								});
								setMainImage(image);
							}}
							onRemoveFinished={() => {
								resetField("mainImage");
								setMainImage(undefined);
							}}
						/>
					</div>
					<div className={mainImage ? "hidden" : "text-red-500 text-xs italic "}>
						{errors.mainImage && "Main picture is required"}
					</div>
					<label htmlFor="additional info" className="text-sm font-medium text-gray-700 sm:col-span-6 ">
						Additional Info
					</label>

					{/* Additional info item */}
					<div className="sm:col-span-6 space-y-2">
						<div className="flex flex-wrap">
							{addInfo.map((info, index) => {
								return (
									<div key={info.id} className="card shadow-md hover:shadow-lg md:w-2/4 flex">
										<HiX
											className="self-end w-4 h-4 m-2 hover:cursor-pointer hover:bg-warning rounded-md"
											onClick={() => removeDetail(index)}
										/>
										<div className="card-body pt-0">
											{/* Title */}
											<label htmlFor={"title" + index} className="text-sm font-normal text-gray-700">
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
											<label htmlFor={"detail" + index} className="block text-sm font-normal text-gray-700">
												Details
											</label>
											<div className="mt-1">
												<Editor
													defaultContentState={convertToRaw(convertFromRaw(info.detail))}
													toolbarClassName="toolbarClassName"
													wrapperClassName="wrapperClassName"
													editorClassName="editorClassName"
													onContentStateChange={content => {
														setValue(`details.${index}.detail`, content, {
															shouldDirty: true,
														});
													}}
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
									const newInfo = {
										id: uuid(),
										title: "",
										detail: content as RawDraftContentState,
									};
									appendDetail(newInfo);
								}}>
								Add more
							</div>
						</div>
					</div>

					{/* Variants */}
					{variants.map((variant, index) => {
						register(`variants.${index}.id`, { value: variant.id });
						register(`variants.${index}.onSalePrice.id`, {
							value: variant.onSalePrice?.id,
						});
						return (
							<div key={variant.id} className="grid sm:col-span-6 space-y-2">
								{/* Divider */}
								<div className="relative sm:col-span-6">
									<div className="absolute inset-0 flex items-center" aria-hidden="true">
										<div className="w-full border-t border-gray-300" />
									</div>
									<div className="relative flex justify-center">
										<span className="px-2 bg-white text-sm text-gray-500">Variant</span>
									</div>
								</div>

								{/* Variant Name */}
								<div className="sm:col-span-6">
									<div className="flex justify-between items-center">
										<label htmlFor="variant name" className="text-sm font-medium text-gray-700">
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
								<div className="sm:col-span-2 mr-2">
									<label htmlFor="price" className="text-sm font-medium text-gray-700">
										Price
									</label>
									<div className="mt-1 relative rounded-md shadow-sm">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<span className="text-gray-500 sm:text-sm">€</span>
										</div>
										<input
											type="number"
											id="price"
											step="0.01"
											autoComplete="price"
											{...register(`variants.${index}.price`, {
												required: true,
												min: 0.01,
											})}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
												const newVariant = {
													...getValues(`variants.${index}`),
												};
												newVariant.price = Number(Number(event.target.value).toFixed(2));
												setNewVariants([...newVariants.filter(item => item.id !== newVariant.id), newVariant]);
											}}
											className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<span className="text-gray-500 sm:text-sm" id="price-currency">
												EUR
											</span>
										</div>
									</div>
									<div className="text-red-500 text-xs italic">
										{errors.variants && errors.variants[index]
											? errors.variants[index].price && "Price is required"
											: undefined}
									</div>
								</div>

								{/* On sale price */}
								<div className="sm:col-span-2 mr-2">
									<label htmlFor="on sale price" className="text-sm font-medium text-gray-700">
										On Sale Price
									</label>
									<div className="mt-1 relative rounded-md shadow-sm">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<span className="text-gray-500 sm:text-sm">€</span>
										</div>
										<input
											type="number"
											id="on sale price"
											className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
											step="0.01"
											autoComplete="price"
											aria-describedby="price-currency"
											{...register(`variants.${index}.onSalePrice.value`, {
												min: 0.01,
											})}
											onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
												const newVariant = {
													...getValues(`variants.${index}`),
												};
												newVariant.onSalePrice = {
													id: variant.onSalePrice?.id || "new",
													value: Number(Number(event.target.value).toFixed(2)),
												};
												setNewOnSalePrices([
													...newOnSalePrices.filter(item => item.id !== newVariant.id),
													newVariant,
												]);
											}}
										/>
										<div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
											<span className="text-gray-500 sm:text-sm" id="price-currency">
												EUR
											</span>
										</div>
									</div>
									<div className="text-red-500 text-xs italic">
										{errors.variants && errors.variants[index]
											? errors.variants[index].price && "Price is required"
											: undefined}
									</div>
								</div>

								{/* Stock */}
								<div className="sm:col-span-2">
									<label htmlFor="stock" className="text-sm font-medium text-gray-700">
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
								<div className="sm:col-span-6 relative">
									<ProductImages index={index} />
								</div>
							</div>
						);
					})}

					<div className="sm:col-span-6">
						<div className="pt-5 flex justify-between">
							<div
								className="btn btn-primary"
								onClick={() => {
									const newVar = {
										id: uuid(),
										name: "",
										price: 0,
										stock: 0,
										images: [],
									};
									appendVariant(newVar);
								}}>
								Add More Variant
							</div>
							<div className="flex justify-end space-x-2">
								<div className="btn btn-ghost" onClick={() => router.back()}>
									Cancel
								</div>
								<input type="submit" className="btn btn-primary" disabled={!isDirty}></input>
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
