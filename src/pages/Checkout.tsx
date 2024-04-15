import { useEffect, useState } from "react";
import useUserContext from "../hooks/useUserContext";
import { UserContextType } from "../context/UserContext";
import AddressOption from "../components/AddressOption";
import AddressForm from "../components/AddressForm";
import { IOption } from "../components/Select";
import { State } from "country-state-city";
import { IShippingInfo } from "../types";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import { errorHandler } from "../utils/errorHandler";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Button from "../components/Button";
import { CartItemType } from "./Cart";
import CartItem from "../components/CartItem";
import { currencyFormatter } from "../utils/currencyFormat";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface IFormInput {
	name: string;
	phone: number;
	pincode: number;
	locality: string;
	address: string;
	city: string;
	state: string;
	addressType: string;
	alternatePhone?: number | null;
}

// yup schema
const schema = yup.object().shape({
	name: yup.string().required("Name is a required field"),
	phone: yup
		.number()
		.required("Phone number is required")
		.typeError("Phone must be a number"),
	pincode: yup.number().required("Pincode is required"),
	locality: yup.string().required("Locality is required"),
	address: yup.string().required("Address is required"),
	city: yup.string().required("City is required"),
	state: yup.string().required("State is required"),
	addressType: yup.string().required("Address type is required"),
	alternatePhone: yup
		.number()
		.nullable()
		.typeError("Alternate phone must be a number")
		.notRequired(),
});

const Checkout = () => {
	const [step, setStep] = useState(1);
	const [selectedAddress, setSelectedAddress] =
		useState<IShippingInfo | null>(null);
	const [states, setStates] = useState<IOption[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isNewFormOpen, setIsNewFormOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [id, setId] = useState<string | undefined>("");
	const [cart, setCart] = useState<CartItemType[]>([]);

	const [searchParams] = useSearchParams();

	const methods = useForm<IFormInput>({
		resolver: yupResolver(schema),
		defaultValues: {
			alternatePhone: null,
		},
	});

	const navigate = useNavigate();

	const totalAmount = cart
		.map((item) => item.productId.price * item.quantity)
		.reduce((prev, acc) => prev + acc, 0);
	const totalDiscount =
		cart
			.map(
				(item) =>
					item.productId.price *
					item.productId.discount *
					item.quantity
			)
			.reduce((prev, acc) => prev + acc, 0) / 100;

	const { userState, setUserState } = useUserContext() as UserContextType;

	const axiosPrivate = useAxiosPrivate();

	const getStates = () => {
		const res = State.getStatesOfCountry("IN");
		const states = res.map((item) => ({
			id: item.name,
			name: item.name,
		}));
		setStates(states);
	};

	const handlePopulateValues = (shippingInfo: IShippingInfo) => {
		getStates();
		Object.entries(shippingInfo).forEach(([name, value]) => {
			if (
				name === "name" ||
				name === "phone" ||
				name === "pincode" ||
				name === "locality" ||
				name === "address" ||
				name === "city" ||
				name === "state" ||
				name === "addressType" ||
				name === "alternatePhone"
			) {
				methods.setValue(name, value);
			}
			setIsEditing(true);
			setIsFormOpen(true);
			setId(shippingInfo?._id);
		});
	};

	const handleCancel = () => {
		setIsFormOpen(false);
		methods.reset();
		setIsEditing(false);
		setId("");
	};

	const handleUpdateAddress = (formData: IFormInput) => {
		setIsLoading(true);
		axiosPrivate
			.put(`/user/shippingAddress/update/${id}`, formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Updation of address failed, Please try again"
					);
				}
				setUserState((prev) => {
					if (prev) {
						const updatedUserState = {
							...prev,
							shippingAddresses:
								res.data.data.user.shippingAddresses,
						};
						return updatedUserState;
					}
					return null;
				});
				methods.reset();
				setIsFormOpen(false);
				toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleAddNewAddress = (formData: IFormInput) => {
		setIsLoading(true);
		axiosPrivate
			.post("/user/shippingAddress/new", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Addition of new address failed, Please try again"
					);
				}
				setUserState((prev) => {
					if (prev) {
						const updatedUserState = {
							...prev,
							shippingAddresses:
								res.data.data.user.shippingAddresses,
						};
						return updatedUserState;
					}
					return null;
				});
				methods.reset();
				setIsFormOpen(false);
				setIsNewFormOpen(false);
				toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	const handleMakePayment = async () => {
		const stripe: Stripe | null = await loadStripe(
			import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
		);
		const res = await axiosPrivate.post("/create-checkout-session", {
			selectedAddress,
			cart,
		});
		await stripe?.redirectToCheckout({
			sessionId: res.data.data.sessionId,
		});
	};

	const onSubmit: SubmitHandler<IFormInput> = async (
		formData: IFormInput
	) => {
		if (isEditing) {
			handleUpdateAddress(formData);
		} else {
			handleAddNewAddress(formData);
		}
	};

	useEffect(() => {
		const getCartItems = () => {
			setIsLoading(true);
			axiosPrivate
				.get(`/products/cart`)
				.then((res) => {
					setCart(res.data.data.cart);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		getCartItems();
	}, [axiosPrivate]);

	if (searchParams.get("status") === "success") {
		return (
			<div className="h-full min-h-[80vh] flex items-center justify-center w-full">
				<div className="w-[28rem] p-8 rounded-md shadow-2xl">
					<span className="text-2xl font-semibold block mb-3 text-green-600">
						Thank You! 😊
					</span>
					<div className="flex items-center gap-2 text-green-600 text-3xl">
						<p>Order placed</p>
						<IoIosCheckmarkCircle />
					</div>
					<div
						className="flex items-center justify-end mt-12"
						onClick={() => navigate("/myProfile/orders")}
					>
						<Button varient="default" size="default">
							Go to Orders
						</Button>
					</div>
				</div>
			</div>
		);
	}

	if (searchParams.get("status") === "failed") {
		return (
			<div className="h-full min-h-[80vh] flex items-center justify-center w-full">
				<div className="w-[28rem] p-8 rounded-md shadow-2xl">
					<span className="text-2xl block font-semibold mb-3 text-red-600">
						Oh Ohh! 😔
					</span>
					<div className="flex items-center gap-2 text-red-600 text-3xl">
						<p>Payment failed</p>
						<RxCross2 />
					</div>
					<div
						className="flex items-center justify-end mt-12"
						onClick={() => navigate("/checkout")}
					>
						<Button varient="default" size="default">
							Try again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	const addresses = (
		<div className="flex w-full flex-col">
			{userState?.shippingAddresses.map((address, i) => (
				<div key={address._id}>
					{address?._id === id && isFormOpen ? (
						<AddressForm
							getStates={getStates}
							handleCancel={handleCancel}
							isEditing={isEditing}
							isLoading={isLoading}
							methods={methods}
							onSubmit={onSubmit}
							states={states}
							key={i}
						/>
					) : (
						<AddressOption
							shippingInfo={address}
							setData={handlePopulateValues}
							index={i}
							isSelected={selectedAddress?._id === address._id}
							setSelectedAddress={setSelectedAddress}
							key={i}
							setStep={setStep}
						/>
					)}
				</div>
			))}
			<div className="py-6">
				<div
					className={`rounded-md p-3  flex items-center gap-4 text-sm ${
						isNewFormOpen
							? "text-secondaryForeground"
							: "border cursor-pointer hover:text-secondaryForeground"
					}`}
					onClick={() => setIsNewFormOpen(true)}
				>
					{!isNewFormOpen && <FaPlus />}
					<span className="uppercase">Add a new address</span>
				</div>
				{isNewFormOpen && (
					<AddressForm
						getStates={getStates}
						handleCancel={() => {
							setIsNewFormOpen(false);
							methods.reset();
							setIsEditing(false);
						}}
						isEditing={isEditing}
						isLoading={isLoading}
						methods={methods}
						onSubmit={onSubmit}
						states={states}
					/>
				)}
			</div>
		</div>
	);

	const orderSummary = (
		<div className="flex w-full flex-col">
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between">
					<span>Deliver to:</span>
					<Button
						varient="outline"
						size="default"
						onClick={() => setStep(1)}
					>
						Change
					</Button>
				</div>
				<div className="flex flex-col">
					<div className="flex items-center gap-4 mb-2">
						<span>{selectedAddress?.name}</span>
						<span className="px-2 py-1 bg-gray-100 text-mutedForeground rounded-md text-[10px] uppercase shadow-md">
							{selectedAddress?.addressType}
						</span>
					</div>
					<p className="w-[60%] text-sm font-light text-mutedForeground">
						{`${selectedAddress?.address}, ${selectedAddress?.locality}, ${selectedAddress?.city} (City.), ${selectedAddress?.state} - ${selectedAddress?.pincode}`}
					</p>
				</div>
			</div>
			<div className="flex flex-col">
				{cart?.map((item, i) => (
					<CartItem
						cartItemId={item._id}
						product={item.productId}
						quantityNum={item.quantity}
						setCartHook={setCart}
						className={`${
							i === cart.length - 1 ? "border-b-0" : ""
						}`}
						key={item._id}
					/>
				))}
			</div>
			<div className="w-full flex items-center justify-end py-4">
				<Button varient="default" size="lg" onClick={() => setStep(3)}>
					Continue
				</Button>
			</div>
		</div>
	);

	const payment = (
		<div className="w-full flex flex-col">
			<div className="py-4">
				<Button
					varient="outline"
					size="default"
					className="gap-2"
					onClick={() => setStep(2)}
				>
					<FaArrowLeftLong />
					<span>Back</span>
				</Button>
			</div>
			<h2 className="text-lg p-4 border-b uppercase font-semibold text-mutedForeground">
				Price Details
			</h2>
			<div className="flex flex-col gap-4 p-6">
				<div className="flex items-center justify-between">
					<span>
						Price ({cart.length}{" "}
						{cart.length > 1 ? "items" : "item"})
					</span>
					<span>
						{currencyFormatter.format(totalAmount).split(".")[0]}
					</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Discount</span>
					<span className="text-successForground">
						-{currencyFormatter.format(totalDiscount).split(".")[0]}
					</span>
				</div>
				<div className="flex items-center justify-between">
					<span>Delivery Charges</span>
					<div className="flex items-center gap-1">
						<span className="text-mutedForeground line-through">
							{currencyFormatter.format(180).split(".")[0]}
						</span>
						<span className="text-successForground">Free</span>
					</div>
				</div>
				<div className="flex items-center justify-between py-6 border-t-2 border-b-2 border-dashed mt-4">
					<span className="text-lg font-semibold">Total Amount</span>
					<span className="text-lg font-semibold">
						{
							currencyFormatter
								.format(totalAmount - totalDiscount)
								.split(".")[0]
						}
					</span>
				</div>
				<div className="text-successForground font-semibold">
					You will save{" "}
					{currencyFormatter.format(totalDiscount).split(".")[0]} on
					this order
				</div>
			</div>
			<div className="p-4 w-full">
				<Button
					varient="default"
					size="lg"
					className="w-full"
					onClick={handleMakePayment}
				>
					Make Payment
				</Button>
			</div>
		</div>
	);

	return (
		<div className="w-full flex justify-center">
			<div className="w-[50%] flex flex-col">
				<div className="flex w-full px-4 pb-16 pt-4 items-center justify-between gap-2">
					<div className="flex flex-col items-center justify-center relative">
						<div
							className={`w-7 h-7 border text-xs border-blue rounded-full flex items-center justify-center ${
								step >= 1
									? "bg-blue text-white"
									: "bg-white text-blue"
							}`}
						>
							{step > 1 ? <span>&#10004;</span> : <span>1</span>}
						</div>
						<span
							className={`absolute top-[110%] text-nowrap text-sm ${
								step === 1
									? "text-black"
									: step > 1
									? "text-mutedForeground"
									: "text-gray-400"
							}`}
						>
							Address
						</span>
					</div>
					<hr
						className={`flex-1 ${
							step >= 2
								? "border-t-2 border-t-blue"
								: "border-t border-t-gray-700"
						}`}
					/>
					<div className="flex flex-col items-center justify-center relative">
						<div
							className={`w-7 h-7 border text-xs border-blue rounded-full flex items-center justify-center ${
								step >= 2
									? "bg-blue text-white"
									: "bg-white text-blue"
							}`}
						>
							{step > 2 ? <span>&#10004;</span> : <span>2</span>}
						</div>
						<span
							className={`absolute top-[110%] text-nowrap text-sm ${
								step === 2
									? "text-black"
									: step > 2
									? "text-mutedForeground"
									: "text-gray-400"
							}`}
						>
							Order Summary
						</span>
					</div>
					<hr
						className={`flex-1 ${
							step >= 3
								? "border-t-2 border-t-blue"
								: "border-t border-t-gray-700"
						}`}
					/>
					<div className="flex flex-col items-center justify-center relative">
						<div
							className={`w-7 h-7 border text-xs border-blue rounded-full flex items-center justify-center ${
								step >= 3
									? "bg-blue text-white"
									: "bg-white text-blue"
							}`}
						>
							{step > 3 ? <span>&#10004;</span> : <span>3</span>}
						</div>
						<span
							className={`absolute top-[110%] text-nowrap text-sm ${
								step === 3
									? "text-black"
									: step > 3
									? "text-mutedForeground"
									: "text-gray-400"
							}`}
						>
							Payment
						</span>
					</div>
				</div>
				<div>
					{step === 1
						? addresses
						: step === 2
						? orderSummary
						: payment}
				</div>
			</div>
		</div>
	);
};

export default Checkout;
