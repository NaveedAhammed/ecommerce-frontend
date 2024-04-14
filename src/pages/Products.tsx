import { Slider } from "@mui/material";
import Button from "../components/Button";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { useNavigate, useSearchParams } from "react-router-dom";
import publicAxios from "../utils/axios";
import { IChildCategory, IParentCategory, IProduct } from "../types";
import ProductItem from "../components/ProductItem";
import { errorHandler } from "../utils/errorHandler";
import Loader from "../components/Loader";

const minDistance = 1000;

const Products = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const minPriceParam = searchParams.get("minPrice")
		? Number(searchParams.get("minPrice"))
		: 0;
	const maxPriceParam = searchParams.get("maxPrice")
		? Number(searchParams.get("maxPrice"))
		: 30000;
	const [price, setPrice] = useState([minPriceParam, maxPriceParam]);
	const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
	const [brands, setBrands] = useState<string[]>([]);
	const [parentCategories, setParentCategories] = useState<IParentCategory[]>(
		[]
	);
	const [childCategories, setChildCategories] = useState<IChildCategory[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const parentCategoryParam = searchParams.get("parentCategory");
	const brandsParam = searchParams.get("brands");
	const childCategoryParam = searchParams.get("childCategory");
	const searchParam = searchParams.get("search");
	const discountParam = searchParams.get("discount");
	const featured = searchParams.get("featured");
	const newArrivals = searchParams.get("newArrivals");

	const updateSearchParams = (key: string, value: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		if (!value || value === "[]") {
			newSearchParams.delete(key);
		} else {
			newSearchParams.set(key, value);
		}
		setSearchParams(newSearchParams);
	};

	const handleBrandAddition = (brand: string) => {
		if (brandsParam) {
			const newBrands = JSON.parse(brandsParam) as Array<string>;
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

	const handleDiscountAddition = (discount: string) => {
		if (discountParam && discount === discountParam) {
			return updateSearchParams("discount", "");
		}
		return updateSearchParams("discount", discount);
	};

	const handleCategoriesClear = () => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.delete("childCategory");
		newSearchParams.delete("parentCategory");
		newSearchParams.delete("brands");
		setChildCategories([]);
		setSearchParams(newSearchParams);
	};

	const handleCategoryChange = (childCategory: string) => {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("childCategory", childCategory);
		newSearchParams.delete("brands");
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

	const handleBrandChecked = (brand: string): boolean => {
		if (brandsParam) {
			const parsed = JSON.parse(brandsParam);
			return parsed.includes(brand);
		}
		return false;
	};

	const handlePriceChange = (
		_: Event,
		newValue: number | number[],
		activeThumb: number
	) => {
		if (!Array.isArray(newValue)) {
			return;
		}
		if (activeThumb === 0) {
			const minPriceValue = Math.min(newValue[0], price[1] - minDistance);
			setPrice([minPriceValue, price[1]]);
			minPriceValue === 0
				? updateSearchParams("minPrice", "")
				: updateSearchParams("minPrice", `${minPriceValue}`);
		} else {
			const maxPriceValue = Math.max(newValue[1], price[0] + minDistance);
			setPrice([price[0], maxPriceValue]);
			maxPriceValue === 30000
				? updateSearchParams("maxPrice", "")
				: updateSearchParams("maxPrice", `${maxPriceValue}`);
		}
	};

	const handleDiscountChecked = (discount: string) => {
		if (discountParam) {
			return discount === discountParam;
		}
		return false;
	};

	const handlePriceClear = () => {
		setPrice([0, 30000]);
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.delete("minPrice");
		newSearchParams.delete("maxPrice");
		setSearchParams(newSearchParams);
	};

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();

		const getProducts = () => {
			setIsLoading(true);
			const parentCaregoryId = getParentCategoryId || "";
			const childCaregoryId = getChildCategoryId || "";
			const url = `/filteredProducts?search=${
				searchParam ? searchParam : ""
			}&parentCategoryId=${parentCaregoryId}&childCategoryId=${childCaregoryId}&brands=${brandsParam}&discount=${
				discountParam ? discountParam : 0
			}&featured=${featured}&newArrivals=${newArrivals}&minPrice=${minPriceParam}&maxPrice=${maxPriceParam}`;
			publicAxios
				.get(url, { signal: controller.signal })
				.then((res) => {
					isMounted &&
						setFilteredProducts(res.data.data.filteredProducts);
					isMounted && setBrands(res.data.data.brands);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		getProducts();

		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [
		getChildCategoryId,
		getParentCategoryId,
		searchParam,
		brandsParam,
		discountParam,
		newArrivals,
		featured,
		minPriceParam,
		maxPriceParam,
	]);

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
			const item = parentCategories.find(
				(item) => item.name === parentCategoryParam
			);
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
						{(parentCategoryParam ||
							childCategoryParam ||
							brandsParam) && (
							<Button
								varient="link"
								size="default"
								className="pr-0"
								onClick={() => navigate("/products")}
							>
								Clear All
							</Button>
						)}
					</div>
					<div className="flex w-full flex-wrap gap-2">
						{parentCategoryParam && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={handleCategoriesClear}
							>
								<span className="pr-2 border-r border-r-white">
									{parentCategoryParam}
								</span>
								<RxCross2 />
							</div>
						)}
						{childCategoryParam && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={() =>
									updateSearchParams("childCategory", "")
								}
							>
								<span className="pr-2 border-r border-r-white">
									{childCategoryParam}
								</span>
								<RxCross2 />
							</div>
						)}
						{featured && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={() =>
									updateSearchParams("featured", "")
								}
							>
								<span className="pr-2 border-r border-r-white">
									Featured
								</span>
								<RxCross2 />
							</div>
						)}
						{newArrivals && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={() =>
									updateSearchParams("newArrivals", "")
								}
							>
								<span className="pr-2 border-r border-r-white">
									New Arrivals
								</span>
								<RxCross2 />
							</div>
						)}
						{brandsParam &&
							JSON.parse(brandsParam).map((it: string) => (
								<div
									className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
									onClick={() => handleBrandAddition(it)}
									key={it}
								>
									<span className="pr-2 border-r border-r-white">
										{it}
									</span>
									<RxCross2 />
								</div>
							))}
						{discountParam && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={() =>
									updateSearchParams("discount", "")
								}
							>
								<span className="pr-2 border-r border-r-white">
									{discountParam}% or more
								</span>
								<RxCross2 />
							</div>
						)}
						{minPriceParam > 0 && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={() => {
									updateSearchParams("minPrice", "");
									setPrice((prev) => [0, prev[1]]);
								}}
							>
								<span className="pr-2 border-r border-r-white">
									Min Price: {minPriceParam}
								</span>
								<RxCross2 />
							</div>
						)}
						{maxPriceParam < 30000 && (
							<div
								className="flex h-fit py-2 rounded-md cursor-pointer items-center px-4 bg-secondaryForeground text-white gap-2 w-fit text-xs hover:line-through"
								onClick={() => {
									updateSearchParams("maxPrice", "");
									setPrice((prev) => [prev[0], 30000]);
								}}
							>
								<span className="pr-2 border-r border-r-white">
									Max Price: {maxPriceParam}
								</span>
								<RxCross2 />
							</div>
						)}
					</div>
				</div>
				<nav className="flex flex-col py-3">
					<div className="px-4 flex flex-col border-b pb-4">
						<div className="flex items-center justify-between h-10">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Categories
							</span>
							{parentCategoryParam && (
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
																	handleCategoryChange(
																		childCategory.name
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
						<div className="flex h-10 items-center justify-between">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Price
							</span>
							{(minPriceParam > 0 || maxPriceParam < 30000) && (
								<Button
									varient="link"
									size="default"
									className="pr-0 text-xs"
									onClick={handlePriceClear}
								>
									Clear
								</Button>
							)}
						</div>
						<Slider
							aria-labelledby="range-slider"
							value={price}
							onChange={handlePriceChange}
							valueLabelDisplay="auto"
							disableSwap
							min={0}
							max={30000}
							step={100}
							style={{
								color: "hsl(215.4 16.3% 46.9%)",
							}}
						/>
					</div>
					{brands.length > 0 && (
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
								{brands.map((brand) => (
									<div
										className="flex items-center gap-2 w-full"
										key={brand}
									>
										<input
											type="checkbox"
											id={brand}
											onChange={() => {
												handleBrandAddition(brand);
											}}
											checked={handleBrandChecked(brand)}
										/>
										<label
											htmlFor={brand}
											className="cursor-pointer"
										>
											{brand}
										</label>
									</div>
								))}
							</div>
						</div>
					)}
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
								<input type="checkbox" id="5" />
								<label htmlFor="5">4&#9733; & above</label>
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
						<div className="flex items-center justify-between h-10">
							<span className="text-xs font-semibold text-mutedForeground uppercase">
								Discount
							</span>
							{discountParam && (
								<Button
									varient="link"
									size="default"
									className="pr-0 text-xs"
									onClick={() =>
										updateSearchParams("discount", "")
									}
								>
									Clear
								</Button>
							)}
						</div>
						<div className="flex flex-col gap-2 text-sm">
							<div className="flex items-center gap-2 w-full">
								<input
									type="radio"
									id="50"
									name="discount"
									onChange={() =>
										handleDiscountAddition("50")
									}
									checked={handleDiscountChecked("50")}
								/>
								<label htmlFor="50" className="cursor-pointer">
									50% or more
								</label>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input
									type="radio"
									name="discount"
									id="40"
									onChange={() =>
										handleDiscountAddition("40")
									}
									checked={handleDiscountChecked("40")}
								/>
								<label htmlFor="40" className="cursor-pointer">
									40% or more
								</label>
							</div>
							<div className="flex items-center gap-2 w-full">
								<input
									id="30"
									type="radio"
									name="discount"
									onChange={() =>
										handleDiscountAddition("30")
									}
									checked={handleDiscountChecked("30")}
								/>
								<label htmlFor="30" className="cursor-pointer">
									30% or more
								</label>
							</div>
						</div>
					</div>
				</nav>
			</div>
			<div className="w-[80%] grid grid-cols-5 h-fit gap-y-6 relative">
				{isLoading && (
					<div className="w-full min-h-[80vh] h-full bg-white/70 z-[5] flex items-center justify-center absolute top-0 left-0">
						<Loader color="black" height="3rem" width="3rem" />
					</div>
				)}
				{filteredProducts.length > 0 &&
					filteredProducts.map((product) => (
						<ProductItem
							product={product}
							key={product._id}
							className="border-0 shadow-none"
						/>
					))}
				<div className="w-full col-span-5 flex items-center p-4 justify-center gap-3">
					<Button
						varient="outline"
						size="lg"
						onClick={() => {}}
						disabled
					>
						Previous
					</Button>
					<span>1</span>
					<Button varient="outline" size="lg" onClick={() => {}}>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
};

export default Products;
