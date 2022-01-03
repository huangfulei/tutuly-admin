import { SEO } from "../common/components/SEO";
import ProductList from "./../common/components/productList/ProductList";
import Link from "next/link";
interface AllProductsProps {}

const AllProducts: React.FunctionComponent<AllProductsProps> = () => {
  return (
    <>
      <SEO />
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-900">All Products</h1>

        <Link href="/product?isNew=true" passHref>
          <button className="bg-indigo-600 mb-2 rounded-md py-2 px-4  font-medium text-white hover:bg-indigo-700 focus:outline-none ">
            Add new
          </button>
        </Link>
      </div>
      <ProductList />
    </>
  );
};

export default AllProducts;
