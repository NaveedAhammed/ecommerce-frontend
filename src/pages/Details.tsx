import Button from "../components/Button";
import { IProduct } from "../types";
import { PiHeartDuotone } from "react-icons/pi";
import { FaPlus, FaMinus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import Heading from "../components/Heading";
import Carousel from "../components/Carousel";
import publicAxios from "../utils/axios";
import { useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { currencyFormatter } from "../utils/currencyFormat";
import multiColor from "../assets/multiColor.svg";

const Details = () => {
	const [quantity, setQuantity] = useState(1);
	const [index, setIndex] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [product, setProduct] = useState<IProduct | null>(null);

	const { id } = useParams();

	useEffect(() => {
		const getProductDetails = async () => {
			try {
				setIsLoading(true);
				const res = await publicAxios.get(`/products/${id}`);
				setProduct(res.data.data.product);
			} catch (err) {
				console.log(err);
			} finally {
				setIsLoading(false);
			}
		};

		getProductDetails();
	}, [id]);

	if (isLoading) {
		return (
			<div className="w-full h-[90vh] flex items-center justify-center">
				<Loader color="black" height="5rem" width="5rem" />
			</div>
		);
	}

	return (
		<>
			{product && (
				<>
					<div className="w-full flex py-8 px-8 gap-14">
						<div className="flex gap-5 w-[35%]">
							<div className="flex flex-col gap-2">
								{product?.images?.map((img, i) => (
									<img
										onClick={() => setIndex(i)}
										src={img.url}
										alt=""
										key={img._id}
										className={`w-24 h-28  cursor-pointer rounded-md object-cover ${
											index === i
												? "border-2 border-black"
												: "border border-ring"
										}`}
									/>
								))}
							</div>
							<div className="rounded-md border h-[30rem] w-[25rem]">
								<img
									src={product?.images?.[index].url}
									alt=""
									className="object-contain w-full h-full"
								/>
							</div>
						</div>
						<div className="flex flex-col w-[65%]">
							<div className="flex justify-between gap-8 mb-6">
								<h1 className="text-2xl">{product.title}</h1>
								<PiHeartDuotone
									size={30}
									className="cursor-pointer hover:scale-105"
								/>
							</div>
							<p className="flex flex-col gap-2 mb-6">
								<span className="text-lg text-mutedForeground">
									Description:
								</span>
								<span className="text-base w-[75%] tracking-wider leading-7">
									{product.description}
								</span>
							</p>
							<div className="mb-6 flex gap-2 items-end relative w-fit">
								{product.discount > 0 && (
									<span className="line-through text-lg font-medium text-mutedForeground">
										{
											currencyFormatter
												.format(product.price)
												.split(".")[0]
										}
									</span>
								)}
								<span className="text-3xl font-bold">
									{
										currencyFormatter
											.format(
												(product.price *
													(100 - product.discount)) /
													100
											)
											.split(".")[0]
									}
								</span>
								<span className="inline-block px-2 py-1 absolute right-0 top-0 translate-x-[150%] bg-blue-700/20 text-xs text-blue-900">
									{product.discount}%
								</span>
							</div>
							<div className="flex items-center gap-6 mb-6">
								{product.category && (
									<div className="flex items-center gap-2">
										<span className="text-mutedForeground">
											Category:
										</span>
										<span>{product.category?.name}</span>
									</div>
								)}
								{product?.unit && (
									<div className="flex items-center gap-2">
										<span className="text-mutedForeground">
											{product?.unit?.name}
										</span>
										<span>{product.unit?.value}</span>
									</div>
								)}
								{product?.color && (
									<div className="flex items-center gap-2">
										<span className="text-mutedForeground">
											Color:
										</span>
										<div
											className={`w-6 h-6 rounded-full border`}
											style={{
												backgroundColor: `${product.color?.value}`,
											}}
										>
											{product.color &&
												product.color.value ===
													"multiColor" && (
													<img
														src={multiColor}
														alt=""
														className="object-fill"
													/>
												)}
										</div>
									</div>
								)}
							</div>
							<span
								className={`inline-block px-4 w-fit rounded-full mb-6 py-1 text-xs ${
									product.stock === 0
										? "text-red-600 bg-red-500/25"
										: ""
								} ${
									product.stock > 0 && product.stock < 6
										? "text-yellow-600 bg-yellow-400/35"
										: ""
								} ${
									product.stock > 6
										? "text-successForground bg-success/25"
										: ""
								}`}
							>
								{product.stock > 6
									? "In Stock"
									: product.stock === 0
									? "Out of Stock"
									: "Few Left"}
							</span>
							<div className="flex items-center gap-3 mb-6">
								<Button
									varient="outline"
									size="icon"
									onClick={() =>
										setQuantity((prev) => prev - 1)
									}
									disabled={quantity === 1}
								>
									<FaMinus />
								</Button>
								<span>{quantity}</span>
								<Button
									varient="outline"
									size="icon"
									onClick={() =>
										setQuantity((prev) => prev + 1)
									}
									disabled={
										quantity >= Math.min(product.stock, 6)
									}
								>
									<FaPlus />
								</Button>
							</div>
							<Button
								varient="default"
								size="default"
								className="w-40 gap-2"
								disabled={product.stock === 0}
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
						{/* <Carousel /> */}
					</>
				</>
			)}
		</>
	);
};

export default Details;
