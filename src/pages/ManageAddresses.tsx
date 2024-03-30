import { FaPlus } from "react-icons/fa6";
import Label from "../components/Label";
import Input from "../components/Input";
import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Message from "../components/Message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { State } from "country-state-city";
import Textarea from "../components/Textarea";
import Select, { IOption } from "../components/Select";
import Button from "../components/Button";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import useUserContext from "../hooks/useUserContext";
import { UserContextType } from "../context/UserContext";
import axios from "axios";
import Loader from "../components/Loader";
import AddressItem from "../components/AddressItem";
import { IShippingInfo } from "../types";
import { errorHandler } from "../utils/errorHandler";

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

const ManageAddresses = () => {
	const { setUserState, userState } = useUserContext() as UserContextType;
	const [isLoading, setIsLoading] = useState(false);
	const [states, setStates] = useState<IOption[]>([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [id, setId] = useState<string | undefined>("");

	const methods = useForm<IFormInput>({
		resolver: yupResolver(schema),
		defaultValues: {
			alternatePhone: null,
		},
	});

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
			console.log(name, value);
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
				toast.success(res.data.message);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
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

	const handleDeleteAddress = (shippingAddressId: string | undefined) => {
		const res = axiosPrivate.delete(
			`/user/shippingAddress/delete/${shippingAddressId}`
		);
		toast.promise(res, {
			loading: "Deleting the address...",
			success: (res) => {
				console.log(res.data);
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
				return res.data.message;
			},
			error: (err) => {
				if (axios.isAxiosError<{ message: string }>(err)) {
					if (!err?.response) {
						return "Something went wrong";
					} else {
						return `${err.response?.data?.message}`;
					}
				}
				return "Unexpected error!";
			},
		});
	};

	return (
		<div className="w-full py-6 flex flex-col gap-4 pr-12">
			<h1>Manage Addresses</h1>
			<div
				className={`flex flex-col ${
					isFormOpen ? "border rounded-md bg-gray-100/40" : ""
				}`}
			>
				<div
					className={`rounded-md p-3  flex items-center gap-4 text-sm ${
						isFormOpen
							? "text-secondaryForeground"
							: "border cursor-pointer hover:text-secondaryForeground"
					}`}
					onClick={() => setIsFormOpen(true)}
				>
					{!isFormOpen && <FaPlus />}
					<span className="uppercase">Add a new address</span>
				</div>
				{isFormOpen && (
					<FormProvider {...methods}>
						<form
							className="grid grid-cols-2 gap-6 p-4"
							onSubmit={methods.handleSubmit(onSubmit)}
						>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="name">Name</Label>
								<Input
									autoComplete="off"
									id="name"
									name="name"
									type="text"
									placeholder="Naveed"
									required={true}
									disabled={isLoading}
									className="bg-white"
								/>
								{methods.formState?.errors?.name && (
									<Message error={true}>
										{methods.formState.errors.name.message}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="phone">Phone</Label>
								<Input
									autoComplete="off"
									id="phone"
									name="phone"
									type="number"
									placeholder="919******6"
									required={true}
									disabled={isLoading}
									className="bg-white"
								/>
								{methods.formState?.errors?.phone && (
									<Message error={true}>
										{methods.formState.errors.phone.message}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="pincode">Pincode</Label>
								<Input
									autoComplete="off"
									id="pincode"
									name="pincode"
									type="number"
									placeholder="515**1"
									required={true}
									disabled={isLoading}
									className="bg-white"
								/>
								{methods.formState?.errors?.pincode && (
									<Message error={true}>
										{
											methods.formState.errors.pincode
												.message
										}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="locality">Locality</Label>
								<Input
									autoComplete="off"
									id="locality"
									name="locality"
									type="text"
									placeholder="locality"
									required={true}
									disabled={isLoading}
									className="bg-white"
								/>
								{methods.formState?.errors?.locality && (
									<Message error={true}>
										{
											methods.formState.errors.locality
												.message
										}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4 col-span-2">
								<Label htmlFor="locality">Address</Label>
								<Textarea
									autoComplete="off"
									cols={30}
									rows={5}
									id="address"
									name="address"
									className="col-span-2 bg-white"
									placeholder="Address"
								/>
								{methods.formState?.errors?.address && (
									<Message error={true}>
										{
											methods.formState.errors.address
												.message
										}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="city">City/District</Label>
								<Input
									autoComplete="off"
									id="city"
									name="city"
									required={true}
									type="text"
									placeholder="City/District"
									disabled={isLoading}
									className="bg-white"
								/>
								{methods.formState?.errors?.pincode && (
									<Message error={true}>
										{
											methods.formState.errors.pincode
												.message
										}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="state">State</Label>
								<Select
									id="state"
									name="state"
									required={true}
									className="bg-white"
									options={states}
									onClick={getStates}
								/>
								{methods.formState?.errors?.pincode && (
									<Message error={true}>
										{
											methods.formState.errors.pincode
												.message
										}
									</Message>
								)}
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Label htmlFor="alternatePhone">
									Alternate Phone
								</Label>
								<Input
									autoComplete="off"
									id="alternatePhone"
									name="alternatePhone"
									type="number"
									placeholder="Alternate Phone"
									disabled={isLoading}
									className="bg-white"
								/>
							</div>
							<div className="flex flex-col items-start gap-1 mb-4">
								<Message error={false}>Address Type</Message>
								<div className="flex items-center gap-6">
									<div className="flex items-center gap-2">
										<Label htmlFor="home">Home</Label>
										<input
											autoComplete="off"
											id="home"
											type="radio"
											value="home"
											{...methods.register("addressType")}
											disabled={isLoading}
										/>
									</div>
									<div className="flex items-center gap-2">
										<Label htmlFor="work">Work</Label>
										<input
											autoComplete="off"
											id="work"
											type="radio"
											value="work"
											{...methods.register("addressType")}
											disabled={isLoading}
										/>
									</div>
								</div>
							</div>
							<div className="flex items-center col-span-2 gap-4 justify-end">
								<Button
									varient="outline"
									size="lg"
									onClick={handleCancel}
									disabled={isLoading}
								>
									Cancel
								</Button>
								{!isEditing && (
									<Button
										varient="default"
										size="lg"
										type="submit"
										disabled={isLoading}
										className="gap-2"
									>
										{isLoading && (
											<Loader
												width="1rem"
												height="1rem"
												color="white"
											/>
										)}
										{isLoading ? "Saving..." : "Save"}
									</Button>
								)}
								{isEditing && (
									<Button
										varient="default"
										size="lg"
										type="submit"
										disabled={isLoading}
										className="gap-2"
									>
										{isLoading && (
											<Loader
												width="1rem"
												height="1rem"
												color="white"
											/>
										)}
										{isLoading ? "Updating..." : "Update"}
									</Button>
								)}
							</div>
						</form>
					</FormProvider>
				)}
			</div>
			{userState?.shippingAddresses && (
				<div className="my-4 border border-b-0">
					{userState?.shippingAddresses.map((item) => (
						<AddressItem
							shippingInfo={item}
							key={item?._id}
							setData={handlePopulateValues}
							deleteAddress={handleDeleteAddress}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ManageAddresses;
