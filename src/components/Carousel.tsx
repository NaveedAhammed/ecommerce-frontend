import ProductItem from "./ProductItem";
import { IProduct } from "../types";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import Button from "./Button";
import { useRef, useState } from "react";

const Carousel: React.FC<{ products: IProduct[] }> = ({ products }) => {
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
			{products?.length > 6 && (
				<Button
					size="icon"
					varient="outline"
					className="absolute top-[50%] left-0 translate-x-[-30%] shadow-md translate-y-[-50%] z-[5]"
					onClick={() => handleSlide("left")}
					disabled={index === 0}
				>
					<IoArrowBackOutline />
				</Button>
			)}
			<div className="w-full overflow-hidden py-3">
				<div
					className="flex items-center gap-5 transition duration-500"
					ref={sliderRef}
				>
					{products?.map((product) => (
						<ProductItem product={product} key={product._id} />
					))}
				</div>
			</div>
			{products?.length > 6 && (
				<Button
					size="icon"
					varient="outline"
					className="absolute top-[50%] right-0 translate-x-[30%] translate-y-[-50%] shadow-md z-[5]"
					onClick={() => handleSlide("right")}
					disabled={index > products?.length - 7}
				>
					<IoArrowForwardOutline />
				</Button>
			)}
		</div>
	);
};

export default Carousel;
