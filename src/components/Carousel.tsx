import CarouselItem from "./CarouselItem";
import { IProduct } from "../types";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import Button from "./Button";
import { useRef, useState } from "react";

const product: IProduct = {
	title: "GLORYBOYZ Regular Fit Hawaiian Tropical Printed Kids & Junior Boys Shirt",
	description: "",
	featured: true,
	images: [
		{
			_id: "",
			url: "/shirt.jpeg",
		},
	],
	price: 230,
	reviews: [],
	stock: 10,
	category: {
		_id: "",
		name: "Shirts",
		createdAt: "",
		updatedAt: "",
	},
	color: {
		_id: "",
		name: "Shirts",
		value: "#000000",
		createdAt: "",
		updatedAt: "",
	},
	size: {
		_id: "",
		name: "Medium",
		value: "M",
		createdAt: "",
		updatedAt: "",
	},
};

const Carousel = () => {
	const [index, setIndex] = useState(0);
	const sliderRef = useRef<HTMLDivElement>(null);

	const handleSlide = (dir: string) => {
		if (sliderRef?.current) {
			const slideAmount =
				sliderRef.current.getBoundingClientRect().x - 20;
			console.log(slideAmount);
			if (dir === "left") {
				sliderRef.current.style.transform = `translateX(${
					236.66 + slideAmount
				}px)`;
				setIndex((prev) => prev - 1);
			}
			if (dir === "right") {
				sliderRef.current.style.transform = `translateX(${
					-236.66 + slideAmount
				}px)`;
				setIndex((prev) => prev + 1);
			}
		}
	};

	return (
		<div className="w-full relative mb-4">
			<Button
				size="icon"
				varient="outline"
				className="absolute top-[50%] left-0 translate-x-[-30%] shadow-md translate-y-[-50%] z-[5]"
				onClick={() => handleSlide("left")}
				disabled={index === 0}
			>
				<IoArrowBackOutline />
			</Button>
			<div className="w-full overflow-hidden">
				<div
					className="flex items-center gap-5 transition duration-500"
					ref={sliderRef}
				>
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
					<CarouselItem product={product} isLoading />
				</div>
			</div>
			<Button
				size="icon"
				varient="outline"
				className="absolute top-[50%] right-0 translate-x-[30%] translate-y-[-50%] shadow-md z-[5]"
				onClick={() => handleSlide("right")}
				disabled={index > 3}
			>
				<IoArrowForwardOutline />
			</Button>
		</div>
	);
};

export default Carousel;
