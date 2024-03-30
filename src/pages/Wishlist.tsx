import { useEffect, useState } from "react";
import ProductItem from "../components/ProductItem";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "../components/Loader";
import { IProduct } from "../types";
import { errorHandler } from "../utils/errorHandler";

const Wishlist = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [wishlistProducts, setWishlistProducts] = useState<IProduct[]>([]);

	const axiosPrivate = useAxiosPrivate();

	useEffect(() => {
		const getWishlistProducts = () => {
			setIsLoading(true);
			axiosPrivate
				.get("/products/wishlist")
				.then((res) => {
					setWishlistProducts(res.data.data.wishlistProducts);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		getWishlistProducts();
	}, [axiosPrivate]);

	if (isLoading)
		return (
			<div className="w-full h-[90vh] flex items-center justify-center">
				<Loader color="black" height="5rem" width="5rem" />
			</div>
		);

	return (
		<div className="w-full min-h-[100vh]">
			<h1 className="text-xl font-medium mb-6 ">
				My Wishlist ({wishlistProducts?.length})
			</h1>
			<div className="flex flex-wrap gap-5">
				{wishlistProducts?.map((product) => (
					<ProductItem
						product={product}
						key={product._id}
						setWishlistHook={setWishlistProducts}
					/>
				))}
			</div>
		</div>
	);
};

export default Wishlist;
