import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { GetServerSideProps } from "next";
import Link from "next/link";
import ProductList from "../app/components/modules/productList/ProductList";
import { SEO } from "../app/components/templates/SEO";
import { IProductOverview } from "../app/types/IProductOverview";
import { db } from "./../firebase/clientApp";

interface IProducts {
  products: IProductOverview[];
}

const Products: React.FunctionComponent<IProducts> = (props) => {
  const { products } = props;
  return (
    <>
      <SEO />
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold text-gray-900">All Products</h1>

        <Link href="/product/new" passHref>
          <button className="bg-indigo-600 mb-2 rounded-md py-2 px-4  font-medium text-white hover:bg-indigo-700 focus:outline-none ">
            Add new
          </button>
        </Link>
      </div>
      <ProductList products={products} />
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {
//   const productsRef = collection(db, "products");
//   const q = query(productsRef, orderBy("priority", "desc"));
//   const querySnapshot = await getDocs(q);
//   const products = querySnapshot.docs.map((doc) => {
//     return { ...doc.data(), id: doc.id };
//   });

//   return {
//     props: { products }, // will be passed to the page component as props
//     revalidate: 1,
//   };
// };

export const getServerSideProps: GetServerSideProps = async () => {
  // get products by label and order by priority
  const productsRef = collection(db, "products");
  const q = query(productsRef, orderBy("priority", "desc"));
  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });

  return {
    props: { products }, // will be passed to the page component as props
  };
};

export default Products;
