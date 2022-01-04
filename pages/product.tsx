import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ProductOverview from "../common/components/productOverview/ProductOverview";
import { SEO } from "../common/components/SEO";
import {
  addDocWithAutoID,
  getADoc,
  setDocWithID,
} from "../firebase/firestore/write";
import { IProductOverview } from "./../common/components/productOverview/IProductOverview";
import { deleteADoc } from "./../firebase/firestore/write";
interface ProductProps {}

const newProduct: IProductOverview = {
  status: "Active",
  name: "",
  priority: 0,
  description: "",
  variants: [{ name: "", price: 0, stock: 0, images: [] }],
};
const Product: React.FunctionComponent<ProductProps> = () => {
  const router = useRouter();
  const { isNew, id } = router.query;
  const [product, setProduct] = useState<IProductOverview>(newProduct);
  const [status, setStatus] = useState<string>("Active");

  const onStatusChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const status = event.target.value;
    if (isNew === "false") {
      // update product info
      await setDocWithID("products/" + id, { status: status }, true);
    }
    setStatus(status);
  };

  const onSave = async (data: IProductOverview, isDirty: boolean) => {
    if (data.labels) {
      data.labels = data.labels.map((label) => {
        return label.name;
      });
    }
    if (isDirty) {
      if (isNew === "true") {
        await addDocWithAutoID("products", { ...data, status: status });
      } else {
        await setDocWithID("products/" + id, data, true);
      }
    }
    router.back();
  };

  const onDelete = async () => {
    if (isNew === "false") {
      await deleteADoc("products/" + id);
      router.back();
    }
  };

  useEffect(() => {
    if (isNew === "false") {
      getADoc("products/" + id).then((doc) => {
        if (doc.exists()) {
          const product: IProductOverview = doc.data() as IProductOverview;
          if (product.labels) {
            product.labels = product.labels.map((label) => {
              return { name: label };
            });
          }
          setProduct(product);
          setStatus(product.status);
        }
      });
    }
  }, []);

  return (
    <>
      <SEO />
      <div className="flex justify-between">
        {/* Nav back */}
        <Link href="/allProducts" passHref>
          <div className="flex cursor-pointer">
            <ArrowNarrowLeftIcon className="h-6 w-5" />
            <div className="ml-1 font-medium">All Products</div>
          </div>
        </Link>
        <div className="space-x-2">
          <button className="btn btn-error" onClick={onDelete}>
            Delete
          </button>
          <select
            value={status}
            className="select select-bordered select-info max-w-xs"
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
              onStatusChange(event);
            }}
          >
            <option value={"Active"}>Active</option>
            <option value={"Draft"}>Draft</option>
          </select>
        </div>
      </div>
      <ProductOverview product={product} onSave={onSave} />
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {}, // will be passed to the page component as props
  };
}

export default Product;
