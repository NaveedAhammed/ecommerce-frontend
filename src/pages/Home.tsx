import { useEffect, useState } from "react";
import Carousel from "../components/Carousel";
import Heading from "../components/Heading";
import HeroBanner from "../components/HeroBanner";
import publicAxios from "../utils/axios";
import Loader from "../components/Loader";
import { errorHandler } from "../utils/errorHandler";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const [billboard, setBillboard] = useState(null);
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [newArrivalProducts, setNewArrivalProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		const getHomePageData = async () => {
			setIsLoading(true);
			Promise.all([
				publicAxios.get("/billboard/active"),
				publicAxios.get("/products/featured"),
				publicAxios.get("/products/newArrivals"),
			])
				.then((res) => {
					setBillboard(res[0].data.data.billboard[0]);
					setFeaturedProducts(res[1].data.data.featuredProducts);
					setNewArrivalProducts(res[2].data.data.newArrivalProducts);
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
					action={() => navigate("/products?featured=true")}
					actionLabel="Show more"
				/>
				<Carousel products={featuredProducts} />
			</>
			<>
				<Heading
					title="New Arrivals"
					action={() => navigate("/products?newArrivals=true")}
					actionLabel="Show more"
				/>
				<Carousel products={newArrivalProducts} />
			</>
		</>
	);
};

export default Home;
