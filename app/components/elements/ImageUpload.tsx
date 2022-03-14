import { TrashIcon } from "@heroicons/react/outline";
import { StorageReference, deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";

import { storage } from "../../../firebase/clientApp";
import useLoadingStateStore from "../../context/loadingStateStore";
import { IImage } from "../../types/IImage";
import { cropPreview } from "../../utils/cropPreview";
import { generateDownload } from "../../utils/generateDownload";

import { classNames } from "./../../utils/classNames";
import Modal from "./Modal";

interface ImageUploadProps {
	limit: number;
	location: string;
	aspect: number;
	images?: unknown[];
	width?: number | string;
	height?: number | string;
	onUploadFinished: (image: IImage) => void;
	onRemoveFinished: (image: IImage, index: number) => void;
}
const ImageUpload: React.FunctionComponent<ImageUploadProps> = props => {
	const { limit, images, location, aspect, width, height, onUploadFinished, onRemoveFinished } = props;
	const [openModal, setOpenModal] = useState(false);
	const [imageName, setImageName] = useState<string>("New Image");
	const [imgSrc, setImgSrc] = useState("");
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [uploadedImgs, setUploadedImgs] = useState<IImage[]>((images as IImage[]) || []);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const imgRef = useRef<unknown>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);
	const { setIsLoading } = useLoadingStateStore();

	const uploadImage = async () => {
		setIsLoading(true);
		setOpenModal(false);
		const fileCanvas = await generateDownload(previewCanvasRef.current!);
		fileCanvas.toBlob(
			async blob => {
				if (blob) {
					const resizedName = imageName.slice(0, imageName.indexOf(".")) + "_300x300" + imageName.slice(imageName.indexOf("."));
					const originRef = ref(storage, location + imageName);
					const resizedRef = ref(storage, location + "resized/" + resizedName);

					//   'file' comes from the Blob or File API
					await uploadBytes(originRef, blob);

					// try 3 times to get the new download url
					await setTimeout(async () => {
						try {
							setNewImage(resizedRef, resizedName);
						} catch (error) {
							await setTimeout(async () => {
								try {
									await setNewImage(resizedRef, resizedName);
								} catch {
									await setTimeout(async () => {
										await setNewImage(resizedRef, resizedName);
									}, 2000);
								}
							}, 2000);
						} finally {
							setIsLoading(false);
						}
					}, 2000);
				}
			},
			"image/png",
			1
		);
	};

	const setNewImage = async (resizedRef: StorageReference, resizedName: string) => {
		const url = await getDownloadURL(resizedRef);
		// `url` is the download URL for 'images/stars.jpg'
		const newImage: IImage = {
			name: resizedName,
			src: url,
			alt: resizedName,
		};
		onUploadFinished(newImage);
		setUploadedImgs([...uploadedImgs, newImage]);
	};

	const removeImage = async (image: IImage, index: number) => {
		// Create a reference to the file to delete
		const desertRef = ref(storage, location + image.name);

		// Delete the file
		await deleteObject(desertRef).finally(() => {
			setUploadedImgs([...uploadedImgs.filter(uploadedImg => uploadedImg.name !== image.name)]);
			onRemoveFinished(image, index);
		});
	};

	const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			setImageName(e.target.files[0].name);
			setOpenModal(true);
			setCrop(undefined); // Makes crop preview update between images.
			const reader = new FileReader();
			reader.addEventListener("load", () => setImgSrc(reader.result?.toString() || ""));
			reader.readAsDataURL(e.target.files[0]);
		}
	};

	const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
		imgRef.current = e.currentTarget;
		const { width, height } = e.currentTarget;

		// This is to demonstate how to make and center a % aspect crop
		// which is a bit trickier so we use some helper functions.
		const crop = centerCrop(
			makeAspectCrop(
				{
					unit: "%",
					width: 90,
				},
				aspect,
				width,
				height
			),
			width,
			height
		);

		setCrop(crop);
	};

	const updateCropPreview = useCallback(() => {
		if (completedCrop && previewCanvasRef.current && imgRef.current) {
			cropPreview(imgRef.current as HTMLImageElement, previewCanvasRef.current, completedCrop);
		}
	}, [completedCrop]);

	useEffect(() => {
		updateCropPreview();
	}, [updateCropPreview]);

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
					)}>
					<input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={onSelectFile} />
					<div className="space-y-1 text-center">
						<svg className="mx-auto text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
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
						"aspect-" + aspect,
						"relative flex justify-center hover:opacity-70 items-center h-full w-full mt-1 px-5 py-5 rounded-md hover: cursor-pointer"
					)}>
					<TrashIcon
						className={"text-red-600 h-full w-full absolute z-10 opacity-0 hover:opacity-80 hover:cursor-pointer"}
						onClick={() => removeImage(uploadedImg, index)}
					/>
					<Image className="rounded-md" src={uploadedImg.src} alt={uploadedImg.alt} layout="fill" />
				</div>
			))}
			<Modal
				open={openModal}
				setOpen={open => {
					if (!open) {
						fileInputRef.current!.value = "";
					}
					setOpenModal(open);
				}}>
				{Boolean(imgSrc) && (
					<div className="flex flex-col items-center">
						<ReactCrop
							crop={crop}
							onChange={(_, percentCrop) => setCrop(percentCrop)} // onCrop(itself) change
							onComplete={c => setCompletedCrop(c)}
							aspect={aspect}>
							<img alt="Crop me" src={imgSrc} onLoad={onImageLoad} />
						</ReactCrop>
						<canvas
							ref={previewCanvasRef}
							className={"hidden"}
							style={{
								// Rounding is important for sharpness.
								width: Math.floor(completedCrop?.width ?? 0),
								height: Math.floor(completedCrop?.height ?? 0),
							}}
						/>
						<button
							className="btn btn-primary mt-2"
							disabled={!completedCrop?.width || !completedCrop.height}
							onClick={uploadImage}>
							Confirm
						</button>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default ImageUpload;
