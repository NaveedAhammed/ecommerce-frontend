import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

import Label from "./Label";
import Input from "./Input";
import Message from "./Message";
import Textarea from "./Textarea";
import Button from "./Button";
import Loader from "./Loader";
import Select, { IOption } from "./Select";

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

const AddressForm: React.FC<{
	onSubmit: SubmitHandler<IFormInput>;
	methods: UseFormReturn<IFormInput, IFormInput, undefined>;
	isLoading: boolean;
	isEditing: boolean;
	states: IOption[];
	getStates: () => void;
	handleCancel: () => void;
}> = ({
	onSubmit,
	methods,
	isEditing,
	isLoading,
	states = [],
	getStates,
	handleCancel,
}) => {
	return (
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
							{methods.formState.errors.pincode.message}
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
							{methods.formState.errors.locality.message}
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
							{methods.formState.errors.address.message}
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
							{methods.formState.errors.pincode.message}
						</Message>
					)}
				</div>
				<div className="flex flex-col items-start gap-1 mb-4">
					<Label htmlFor="state">State</Label>
					<Select
						id="state"
						name="state"
						required={true}
						className="bg-white w-full"
						options={states}
						onClick={getStates}
					/>
					{methods.formState?.errors?.pincode && (
						<Message error={true}>
							{methods.formState.errors.pincode.message}
						</Message>
					)}
				</div>
				<div className="flex flex-col items-start gap-1 mb-4">
					<Label htmlFor="alternatePhone">Alternate Phone</Label>
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
	);
};

export default AddressForm;
