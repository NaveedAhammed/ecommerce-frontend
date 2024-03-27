import { useEffect, useState } from "react";
import ProductItem from "../components/ProductItem";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "../components/Loader";
import { IProduct } from "../types";

const Wishlist = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [wishlistProducts, setWishlistProduct] = useState<IProduct[]>([]);

	const axiosPrivate = useAxiosPrivate();

	const handleRemove = (productId: string) => {
		setWishlistProduct((prev) =>
			prev.filter((pro) => pro._id !== productId)
		);
	};

	useEffect(() => {
		const getWishlistProducts = async () => {
			try {
				setIsLoading(true);
				const res = (await axiosPrivate.get("/products/wishlist")).data;
				console.log(res);
				setWishlistProduct(res.data.wishlistProducts);
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
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
			<h1 className="text-3xl font-medium mb-6 ">
				Wishlist Items ({wishlistProducts?.length})
			</h1>
			<div className="grid grid-cols-6 gap-4">
				{wishlistProducts?.map((product) => (
					<ProductItem
						product={product}
						key={product._id}
						onClick={() => handleRemove(product._id)}
					/>
				))}
			</div>
		</div>
	);
};

export default Wishlist;
