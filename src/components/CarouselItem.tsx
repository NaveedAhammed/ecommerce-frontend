import { IProduct } from "../types";
import { PiHeartDuotone } from "react-icons/pi";
import { FaCartShopping } from "react-icons/fa6";
import Button from "./Button";
import { Link } from "react-router-dom";
import { currencyFormatter } from "../utils/currencyFormat";

const CarouselItem: React.FC<{ product: IProduct }> = ({ product }) => {
	return (
		<div className="p-3 rounded-md border relative group w-[216.66px] flex-shrink-0">
			<PiHeartDuotone
				className="absolute top-4 right-4 cursor-pointer z-[5] hover:scale-110"
				size={24}
			/>
			<div className="w-full h-48 rounded-md overflow-hidden cursor-pointer relative mb-2">
				<div className="w-full h-full bg-black/20 absolute top-0 left-0 z-[2] items-center justify-center group-hover:flex hidden">
					<Button
						varient="outline"
						size="icon"
						className="hover:scale-110"
					>
						<FaCartShopping />
					</Button>
				</div>
				<img
					src={product?.images?.[0].url}
					alt={product?.title}
					className="w-full h-full object-contain"
				/>
			</div>
			<div className="flex flex-col gap-1">
				<Link to={`/product/${product._id}`}>
					<span className="text-sm cursor-pointer group-hover:underline">
						{product?.title?.slice(0, 23)}...
					</span>
				</Link>
				<div className="flex items-center gap-2">
					<span className="text-sm text-mutedForeground">
						{product?.category?.name}
					</span>
					{product.discount > 0 && (
						<span className="bg-blue-700/20 text-[10px] text-blue-900 px-[6px] py-[2px] rounded-md">
							{product.discount}%
						</span>
					)}
				</div>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						{product.discount > 0 && (
							<span className="line-through text-sm text-mutedForeground">
								{
									currencyFormatter
										.format(product?.price)
										.split(".")[0]
								}
							</span>
						)}
						<span className="text-lg font-bold">
							{
								currencyFormatter
									.format(
										(product?.price *
											(100 - product.discount)) /
											100
									)
									.split(".")[0]
							}
						</span>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-xs">
							{product.unit?.shortHand}
						</span>
						<div
							className={`w-4 h-4 rounded-full border`}
							style={{
								backgroundColor: `${product.color?.value}`,
							}}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CarouselItem;
