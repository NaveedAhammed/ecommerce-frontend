import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import Heading from "../components/Heading";
import HeroBanner from "../components/HeroBanner";
import publicAxios from "../utils/axios";
import Loader from "../components/Loader";
import { errorHandler } from "../utils/errorHandler";

const Home = () => {
	const [billboard, setBillboard] = useState(null);
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const getHomePageData = async () => {
			setIsLoading(true);
			Promise.all([
				publicAxios.get("/billboard/active"),
				publicAxios.get("/products/featured"),
			])
				.then((res) => {
					setBillboard(res[0].data.data.billboard[0]);
					setFeaturedProducts(res[1].data.data.featuredProducts);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		(featuredProducts.length === 0 || !billboard) && getHomePageData();
	}, [billboard, featuredProducts]);

	if (isLoading)
		return (
			<div className="w-full h-[90vh] flex items-center justify-center">
				<Loader color="black" height="5rem" width="5rem" />
			</div>
		);

	return (
		<>
			<HeroBanner heroBanner={billboard} />
			<>
				<Heading
					title="Featured"
					action={() => {}}
					actionLabel="Show more"
				/>
				<Carousel products={featuredProducts} />
			</>
		</>
	);
};

export default Home;
