import { useEffect } from "react";
import Carousel from "../components/Carousel";
import Heading from "../components/Heading";
import HeroBanner from "../components/HeroBanner";
import publicAxios from "../utils/axios";

const Home = () => {
	// useEffect(() => {
	// 	const getHomePageData = async () => {
	// 		const res = await Promise.all([
	// 			publicAxios.get("")
	// 		])
	// 	}
	// },[]);

	return (
		<>
			<HeroBanner />
			<>
				<Heading
					title="Featured"
					action={() => {}}
					actionLabel="Show more"
				/>
				<Carousel />
			</>
			<>
				<Heading
					title="New Arrivals"
					action={() => {}}
					actionLabel="Show more"
				/>
				<Carousel />
			</>
		</>
	);
};

export default Home;
