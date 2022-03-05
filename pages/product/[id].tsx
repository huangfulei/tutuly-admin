import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import { RawDraftContentState } from "draft-js";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useState } from "react";
import { v4 as uuid } from "uuid";

import ProductOverview from "../../app/components/modules/productOverview/ProductOverview";
import { SEO } from "../../app/components/templates/SEO";
import { IProductOverview } from "../../app/types/IProductOverview";
import { getADoc, setDocWithID } from "../../firebase/firestore/client";
interface ProductProps {
	product: IProductOverview;
	status: string;
}

const Product: React.FunctionComponent<ProductProps> = props => {
	const { product, status: initialStatus } = props;
	const [status, setStatus] = useState(initialStatus);

	const onStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
		const status = event.target.value;
		if (product.id !== "new") {
			// update product info
			await setDocWithID("products/" + product.id, { status: status }, true);
		}
		setStatus(status);
	};

	return (
		<>
			<SEO />
			<div className="flex justify-between">
				{/* Nav back */}
				<Link href="/products" passHref>
					<div className="flex cursor-pointer">
						<ArrowNarrowLeftIcon className="h-6 w-5" />
						<div className="ml-1 font-medium">All Products</div>
					</div>
				</Link>
				<div className="space-x-2">
					{/* <button className="btn btn-error" onClick={onDelete}>
            Delete
          </button> */}
					<select
						value={status}
						className="select select-bordered select-info max-w-xs"
						onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
							onStatusChange(event);
						}}>
						<option value={"Active"}>Active</option>
						<option value={"Draft"}>Draft</option>
					</select>
				</div>
			</div>
			<ProductOverview product={product} />
		</>
	);
};

// export const getStaticPaths: GetStaticPaths = async () => {
//   const snap = await getAllDocs("products");
//   const paths: any[] = snap.docs.map((doc) => ({
//     params: { isNew: "false", id: doc.id },
//   }));
//   paths.push({ params: { isNew: "true", id: "new" } });
//   return { paths, fallback: "blocking" };
// };

export const getServerSideProps: GetServerSideProps = async context => {
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

	let product: IProductOverview = {
		id: "new",
		status: "Active",
		name: "",
		priority: 0,
		rating: 0,
		price: 0,
		labels: [],
		categories: {
			lvl0: "",
			lvl1: "",
			lvl2: "",
		},
		description: content as RawDraftContentState,
		variants: [{ id: uuid(), name: "", price: 0, stock: 0, images: [] }],
	};

	let status = "Active";

	if (context.params?.id) {
		// get products and convert label to be string array
		await getADoc("products/" + context.params.id).then(doc => {
			if (doc.exists()) {
				product = { ...doc.data(), id: doc.id } as IProductOverview;
				status = product.status;
			}
		});
	}

	return {
		props: { product, status }, // will be passed to the page component as props
	};
};

export default Product;
