import { SEO } from "../common/components/SEO";
import ProductOverview from "../common/components/productOverview/productOverview";
import { ArrowNarrowLeftIcon } from "@heroicons/react/outline";
import Link from "next/link";
interface ProductProps {}

const Product: React.FunctionComponent<ProductProps> = () => {
  return (
    <>
      <SEO />
      {/* Nav back */}
      <Link href="/allProducts" passHref>
        <div className="flex cursor-pointer">
          <ArrowNarrowLeftIcon className="h-6 w-5" />
          <div className="ml-1 font-medium">All Products</div>
        </div>
      </Link>
      <ProductOverview />
    </>
  );
};

export default Product;
