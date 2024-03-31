import { Slider } from "@mui/material";
import Button from "../components/Button";
import { RxCross2 } from "react-icons/rx";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

const minDistance = 1000;

const Products = () => {
	const [price, setPrice] = useState([0, 10000]);

	const handlePriceChange = (event, newValue, activeThumb) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setPrice([Math.min(newValue[0], price[1] - minDistance), price[1]]);
		} else {
			setPrice([price[0], Math.max(newValue[1], price[0] + minDistance)]);
		}
	};

	return (
		<div className="w-full max-w-[1400px] mx-auto h-full flex gap-10 relative py-2">
			<div className="w-[20%] border shadow-md rounded-md sticky top-[80px] h-fit left-0 py-2">
				<div className="flex flex-col items-center gap-4 w-full p-4 border-b">
					<div className="w-full flex items-center justify-between">
						<span className="text-lg">Filters</span>
						<Button varient="link" size="default" className="pr-0">
							Clear All
						</Button>
					</div>
					<div className="flex w-full flex-wrap gap-2">
						<Button
							varient="default"
							size="icon"
							className="rounded-full gap-2 w-fit px-4 text-xs hover:line-through"
						>
							<span className="pr-3 border-r border-r-white">
								Men
							</span>
							<RxCross2 />
						</Button>
						<Button
							varient="default"
							size="icon"
							className="rounded-full gap-2 w-fit px-4 text-xs"
						>
							<span className="pr-3 border-r border-r-white">
								Women
							</span>
							<RxCross2 />
						</Button>
						<Button
							varient="default"
							size="icon"
							className="rounded-full gap-2 w-fit px-4 text-xs"
						>
							<span className="pr-3 border-r border-r-white">
								Groceries
							</span>
							<RxCross2 />
						</Button>
					</div>
				</div>
				<nav className="flex flex-col py-3">
					<div className="px-4 flex flex-col border-b pb-4">
						<div className="flex items-center justify-between">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Categories
							</span>
							<Button
								varient="link"
								size="default"
								className="pr-0 text-xs"
							>
								Clear
							</Button>
						</div>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2 w-full text-sm">
								<IoIosArrowForward />
								<span className="cursor-pointer">Men</span>
							</div>
						</div>
					</div>
					<div className="px-4 flex flex-col gap-4 border-b pb-4">
						<div className="flex items-center justify-between">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Price
							</span>
							<Button
								varient="link"
								size="default"
								className="pr-0 text-xs"
							>
								Clear
							</Button>
						</div>
						<Slider
							aria-labelledby="range-slider"
							value={price}
							onChange={handlePriceChange}
							valueLabelDisplay="auto"
							disableSwap
							min={0}
							max={10000}
							step={100}
							style={{
								color: "hsl(215.4 16.3% 46.9%)",
							}}
						/>
					</div>
					<div className="px-4 py-2 flex flex-col border-b pb-4">
						<div className="flex items-center justify-between">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Brand
							</span>
							<Button
								varient="link"
								size="default"
								className="pr-0 text-xs"
							>
								Clear
							</Button>
						</div>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" id="ponds" />
								<label
									htmlFor="ponds"
									className="cursor-pointer"
								>
									Pond's
								</label>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>Apple</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>Samsung</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>Acer</span>
							</div>
						</div>
					</div>
					<div className="px-4 py-2 flex flex-col gap-2 border-b pb-4">
						<div className="flex items-center justify-between">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Customer Ratings
							</span>
							<Button
								varient="link"
								size="default"
								className="pr-0 text-xs"
							>
								Clear
							</Button>
						</div>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>4&#9733; & above</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>3&#9733; & above</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>2&#9733; & above</span>
							</div>
						</div>
					</div>
					<div className="px-4 py-2 flex flex-col gap-2 border-b pb-4">
						<div className="flex items-center justify-between">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Discount
							</span>
							<Button
								varient="link"
								size="default"
								className="pr-0 text-xs"
							>
								Clear
							</Button>
						</div>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>50% or more</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>40% or more</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input type="checkbox" />
								<span>30% or more</span>
							</div>
						</div>
					</div>
				</nav>
			</div>
			<div className="w-[80%]"></div>
		</div>
	);
};

export default Products;
