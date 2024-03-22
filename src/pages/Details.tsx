import Button from "../components/Button";
import { IProduct } from "../types";
import { PiHeartDuotone } from "react-icons/pi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import Heading from "../components/Heading";
import Carousel from "../components/Carousel";

const product: IProduct = {
	title: "GLORYBOYZ Regular Fit Hawaiian Tropical Printed Kids & Junior Boys Shirt",
	description:
		"GLORYBOYZ Regular Fit Floral Hawaiian Tropical Printed Kids & Junior Boys Shirt Combo Pack Of 3. Hawaiian shirt with spread collar, short sleeves curved hem, and straight fit. Front logo button closure. Perfect tailored silhouette",
	featured: true,
	images: [
		{
			_id: "",
			url: "/shirt.jpeg",
		},
		{
			_id: "",
			url: "/shirt.jpeg",
		},
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

const Details = () => {
	const [quantity, setQuantity] = useState(0);
	// const [index, setIndex] = useState(0);

	return (
		<>
			<div className="w-full flex py-8 px-8 gap-14">
				<div className="flex gap-5 w-[35%]">
					<div className="flex flex-col gap-2">
						<img
							src="/shirt.jpeg"
							alt=""
							className="w-24 h-28 border-2 border-ring cursor-pointer rounded-md object-contain"
						/>
						<img
							src="/shirt.jpeg"
							alt=""
							className="w-24 h-28 border rounded-md cursor-pointer object-contain"
						/>
						<img
							src="/shirt.jpeg"
							alt=""
							className="w-24 h-28 border rounded-md cursor-pointer object-contain"
						/>
						<img
							src="/shirt.jpeg"
							alt=""
							className="w-24 h-28 border rounded-md cursor-pointer object-contain"
						/>
					</div>
					<div className="rounded-md border h-[30rem] w-[25rem]">
						<img
							src="/shirt.jpeg"
							alt=""
							className="object-contain w-full h-full"
						/>
					</div>
				</div>
				<div className="flex flex-col w-[65%]">
					<div className="flex justify-between gap-8 mb-6">
						<h1 className="text-2xl">{product.title}</h1>
						<PiHeartDuotone size={30} />
					</div>
					<p className="flex flex-col gap-2 mb-6">
						<span className="text-lg text-mutedForeground">
							Description:
						</span>
						<span className="text-base w-[75%] tracking-wider leading-7">
							{product.description}
						</span>
					</p>
					<span className="text-3xl font-bold mb-6">
						${product.price}
					</span>
					<div className="flex items-center gap-6 mb-6">
						<div className="flex items-center gap-2">
							<span className="text-mutedForeground">
								Category:
							</span>
							<span>{product.category?.name}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-mutedForeground">Size:</span>
							<span>{product.size?.name}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="text-mutedForeground">Color:</span>
							<div
								className={`w-6 h-6 rounded-full border`}
								style={{
									backgroundColor: `${product.color?.value}`,
								}}
							></div>
						</div>
					</div>
					<div className="flex items-center gap-3 mb-6">
						<Button
							varient="outline"
							size="icon"
							onClick={() => setQuantity((prev) => prev - 1)}
							disabled={quantity === 0}
						>
							<FaMinus />
						</Button>
						<span>{quantity}</span>
						<Button
							varient="outline"
							size="icon"
							onClick={() => setQuantity((prev) => prev + 1)}
							disabled={quantity >= 6}
						>
							<FaPlus />
						</Button>
					</div>
					<Button
						varient="default"
						size="default"
						className="w-40 gap-2"
					>
						<span>Add to Cart</span>
						<FaCartShopping />
					</Button>
				</div>
			</div>
			<>
				<Heading
					title="Suggetions"
					action={() => {}}
					actionLabel="Show more"
				/>
				<Carousel />
			</>
		</>
	);
};

export default Details;
