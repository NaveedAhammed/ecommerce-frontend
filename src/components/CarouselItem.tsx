import { IProduct } from "../types";
import { PiHeartDuotone } from "react-icons/pi";
import { FaCartShopping } from "react-icons/fa6";
import Button from "./Button";
import { Link } from "react-router-dom";

const CarouselItem: React.FC<{ product: IProduct; isLoading: boolean }> = ({
	product,
	isLoading,
}) => {
	console.log(isLoading);

	return (
		<div className="p-3 rounded-md border relative group w-[216.66px] flex-shrink-0">
			<PiHeartDuotone
				className="absolute top-4 right-4 cursor-pointer z-[5] hover:scale-110"
				size={24}
			/>
			<div className="w-full h-auto rounded-md overflow-hidden cursor-pointer relative mb-2">
				<div className="w-full h-full bg-black/20 absolute top-0 left-0 z-[2] items-center justify-center group-hover:flex hidden">
					<Button
						varient="outline"
						size="icon"
						className="hover:scale-110"
					>
						<FaCartShopping />
					</Button>
				</div>
				<img src={product?.images?.[0].url} alt={product?.title} />
			</div>
			<div className="flex flex-col gap-1">
				<Link to="/product/123">
					<span className="text-sm cursor-pointer group-hover:underline">
						{product?.title?.slice(0, 23)}...
					</span>
				</Link>
				<span className="text-sm text-mutedForeground">
					{product?.category?.name}
				</span>
				<div className="flex items-center justify-between">
					<span className="text-lg font-bold">${product?.price}</span>
					<div className="flex items-center gap-2">
						<span className="text-xs">{product.size?.value}</span>
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
