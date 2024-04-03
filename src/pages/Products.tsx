import { Slider } from "@mui/material";
import Button from "../components/Button";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { useSearchParams } from "react-router-dom";
import publicAxios from "../utils/axios";
import { IChildCategory, IParentCategory, IProduct } from "../types";
import ProductItem from "../components/ProductItem";

const minDistance = 1000;

const Products = () => {
	const [price, setPrice] = useState([0, 10000]);
	const [searchParams, setSearchParams] = useSearchParams();
	const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
	const [parentCategories, setParentCategories] = useState<IParentCategory[]>(
		[]
	);
	const [childCategories, setChildCategories] = useState<IChildCategory[]>(
		[]
	);

	const parentCategoryParam = searchParams.get("parentCategory");
	const brandsParam = searchParams.get("brands");
	const childCategoryParam = searchParams.get("childCategory");
	const searchParam = searchParams.get("search");

	const handlePriceChange = (
		_: Event,
		newValue: number | number[],
		activeThumb: number
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}

		if (activeThumb === 0) {
			setPrice([Math.min(newValue[0], price[1] - minDistance), price[1]]);
		} else {
			setPrice([price[0], Math.max(newValue[1], price[0] + minDistance)]);
		}
	};

	const updateSearchParams = (key: string, value: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		console.log(value);
		if (!value || value === "[]") {
			newSearchParams.delete(key);
		} else {
			newSearchParams.set(key, value);
		}
		setSearchParams(newSearchParams);
	};

	const handleBrandAddition = (brand: string) => {
		const brands = searchParams.get("brands");
		console.log(brands);
		if (brands) {
			const newBrands = JSON.parse(brands) as Array<string>;
			const index = newBrands.indexOf(brand);
			if (index !== -1) {
				newBrands.splice(index, 1);
			} else {
				newBrands.push(brand);
			}
			updateSearchParams("brands", JSON.stringify(newBrands));
		} else {
			updateSearchParams("brands", JSON.stringify([brand]));
		}
	};

	const handleCategoriesClear = () => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.delete("childCategory");
		newSearchParams.delete("parentCategory");
		setChildCategories([]);
		setSearchParams(newSearchParams);
	};

	const getParentCategoryId = useMemo(() => {
		const parentCategory = parentCategories.find(
			(it) => it.name === parentCategoryParam
		);
		return parentCategory ? parentCategory._id : null;
	}, [parentCategories, parentCategoryParam]);

	const getChildCategoryId = useMemo(() => {
		const childCategory = childCategories.find(
			(it) => it.name === childCategoryParam
		);
		return childCategory ? childCategory._id : null;
	}, [childCategories, childCategoryParam]);

	useEffect(() => {
		const getProducts = () => {
			const parentCaregoryId = getParentCategoryId || "";
			const childCaregoryId = getChildCategoryId || "";
			const url = `/filteredProducts?search=${
				searchParam ? searchParam : ""
			}&parentCategoryId=${parentCaregoryId}&childCategoryId=${childCaregoryId}`;
			publicAxios.get(url).then((res) => {
				setFilteredProducts(res.data.data.filteredProducts);
			});
		};

		getProducts();
	}, [getChildCategoryId, getParentCategoryId, searchParam]);

	useEffect(() => {
		const getParentCategories = () => {
			publicAxios.get("/category/parent/public").then((res) => {
				setParentCategories(res.data.data.parentCategories);
			});
		};

		getParentCategories();
	}, []);

	useEffect(() => {
		const getChildCategories = () => {
			console.log("Hello");
			const item = parentCategories.find(
				(item) => item.name === parentCategoryParam
			);
			console.log(item);
			publicAxios
				.get(`/category/child/public/${item?._id}`)
				.then((res) => {
					setChildCategories(res.data.data.childCategories);
				});
		};

		(parentCategoryParam !== null || "") && getChildCategories();
	}, [parentCategoryParam, parentCategories]);

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
						<div className="flex items-center justify-between h-10">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Categories
							</span>
							{childCategoryParam && (
								<Button
									varient="link"
									size="default"
									className="pr-0 text-xs"
									onClick={handleCategoriesClear}
								>
									Clear
								</Button>
							)}
						</div>
						<div className="flex flex-col">
							{parentCategories.length > 0 &&
								parentCategories.map((parentCategory) => (
									<div
										className={`flex flex-col ${
											parentCategory.name.includes(
												parentCategoryParam || ""
											)
												? "block"
												: "hidden"
										} ${
											parentCategoryParam ===
											parentCategory.name
												? "text-mutedForeground"
												: "text-secondaryForeground"
										}`}
										key={parentCategory._id}
									>
										<div
											className={`flex items-center gap-2 w-full text-sm hover:bg-gray-100 cursor-pointer px-2 py-1 rounded-md`}
											onClick={() =>
												updateSearchParams(
													"parentCategory",
													`${parentCategory.name}`
												)
											}
										>
											{parentCategoryParam &&
											childCategories.length > 0 ? (
												<IoIosArrowDown />
											) : (
												<IoIosArrowForward />
											)}
											<span>{parentCategory.name}</span>
										</div>
										{parentCategoryParam &&
											childCategories.length > 0 && (
												<div className="flex flex-col cursor-pointer text-secondaryForeground">
													{childCategories.map(
														(childCategory) => (
															<span
																className={`text-sm block pl-10 hover:bg-gray-100 py-1 rounded-md ${
																	childCategory.name.includes(
																		childCategoryParam ||
																			""
																	)
																		? "text-secondaryForeground"
																		: "text-mutedForeground"
																} ${
																	childCategoryParam ===
																	childCategory.name
																		? "bg-gray-100"
																		: ""
																}`}
																key={
																	childCategory._id
																}
																onClick={() =>
																	updateSearchParams(
																		"childCategory",
																		`${childCategory.name}`
																	)
																}
															>
																{
																	childCategory.name
																}
															</span>
														)
													)}
												</div>
											)}
									</div>
								))}
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
						<div className="flex items-center justify-between h-10">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Brand
							</span>
							{brandsParam && (
								<Button
									varient="link"
									size="default"
									className="pr-0 text-xs"
									onClick={() =>
										updateSearchParams("brands", "")
									}
								>
									Clear
								</Button>
							)}
						</div>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2 w-full">
								<input
									type="checkbox"
									id="ponds"
									onChange={() =>
										handleBrandAddition("ponds")
									}
								/>
								<label
									htmlFor="ponds"
									className="cursor-pointer"
								>
									Pond's
								</label>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input
									type="checkbox"
									onChange={() =>
										handleBrandAddition("apple")
									}
								/>
								<span>Apple</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input
									type="checkbox"
									onChange={() =>
										handleBrandAddition("samsung")
									}
								/>
								<span>Samsung</span>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input
									type="checkbox"
									onChange={() => handleBrandAddition("acer")}
								/>
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
			<div className="w-[80%] grid grid-cols-5 h-fit gap-y-6">
				{filteredProducts.length > 0 &&
					filteredProducts.map((product) => (
						<ProductItem
							product={product}
							key={product._id}
							className="border-0 shadow-none"
						/>
					))}
			</div>
		</div>
	);
};

export default Products;
