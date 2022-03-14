import { SEO } from "../app/components/templates/SEO";

const Images: React.FunctionComponent = () => {
	return (
		<>
			<SEO />
			<div className="flex justify-between w-full">
				<h1 className="text-2xl font-semibold text-gray-900">Menu</h1>
			</div>
			{/* <ImageUpload
				limit={100}
				location="banner/"
				aspect={16 / 9}
				onUploadFinished={image => console.log(image)}
				onRemoveFinished={image => console.log(image)}
			/> */}
		</>
	);
};

export default Images;
