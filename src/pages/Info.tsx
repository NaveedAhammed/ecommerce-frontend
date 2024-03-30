import { TbCameraPlus } from "react-icons/tb";

import profile from "../assets/profile.webp";
import Button from "../components/Button";
import Label from "../components/Label";
import Input from "../components/Input";
import { ChangeEvent, useRef, useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Message from "../components/Message";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useUserContext from "../hooks/useUserContext";
import { UserContextType } from "../context/UserContext";
import Loader from "../components/Loader";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import toast from "react-hot-toast";
import { errorHandler } from "../utils/errorHandler";

interface IFormInput {
	username: string;
	email: string;
	phone?: number | null;
	gender?: string | null;
}

// yup schema
const schema = yup.object().shape({
	username: yup.string().required("Username is a required field"),
	email: yup
		.string()
		.required("Email is a required field")
		.email("Invaild email"),
	phone: yup
		.number()
		.nullable()
		.typeError("Alternate phone must be a number")
		.notRequired(),
	gender: yup.string().notRequired(),
});

const Info = () => {
	const [isLoadingPic, setIsLoadingPic] = useState(false);
	const [isLoadingInfo, setIsLoadingInfo] = useState(false);
	const [editing, setEditing] = useState(false);
	const [avatar, setAvatar] = useState<File | null>(null);

	const { userState, setUserState } = useUserContext() as UserContextType;

	const axiosPrivate = useAxiosPrivate();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const methods = useForm<IFormInput>({
		resolver: yupResolver(schema),
		defaultValues: {
			username: userState?.username,
			email: userState?.email,
			phone: userState?.phone,
			gender: userState?.gender,
		},
	});

	const handleCameraClick = () => {
		fileInputRef?.current?.click();
	};

	const handleSavePicture = () => {
		if (!avatar) return;
		setIsLoadingPic(true);
		const formData = new FormData();
		formData.append("avatar", avatar);
		axiosPrivate
			.put("/myProfile/picture/update", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Profile picture failed, Please try again"
					);
				}
				const { user: userData } = res.data.data;
				setUserState((prev) => {
					if (prev) {
						return {
							...prev,
							avatar: userData?.avatar,
						};
					}
					return null;
				});
				setAvatar(null);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoadingPic(false);
			});
	};

	const handleUpdatePersonalInfo: SubmitHandler<IFormInput> = (
		formData: IFormInput
	) => {
		setIsLoadingInfo(true);
		axiosPrivate
			.put("/myProfile/update", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Profile update failed, Please try again"
					);
				}
				const { user: userData } = res.data.data;
				setUserState((prev) => {
					if (prev) {
						return {
							...prev,
							username: userData?.username,
							email: userData?.email,
							phone: userData?.phone,
							gender: userData?.gender,
						};
					}
					return null;
				});
				setEditing(false);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoadingInfo(false);
			});
	};

	const handleCancel = () => {
		setAvatar(null);
	};

	const handleUploadPicture = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files && e.target.files[0];
		if (file) {
			setAvatar(file);
		}
	};

	const profilePicture = avatar
		? URL.createObjectURL(avatar)
		: userState?.avatar
		? userState.avatar
		: profile;

	return (
		<div className="w-full flex gap-10 justify-between py-12">
			<div className="flex flex-col items-center w-[50%]">
				<div className="relative">
					<img
						src={profilePicture}
						alt=""
						className="w-40 h-40 rounded-full border object-cover"
					/>
					{!avatar && (
						<Button
							varient="default"
							size="icon"
							className="absolute bottom-0 right-2"
							onClick={handleCameraClick}
						>
							<TbCameraPlus />
						</Button>
					)}
					<input
						type="file"
						name="avatar"
						accept="image/*"
						hidden
						ref={fileInputRef}
						onChange={handleUploadPicture}
					/>
				</div>
				{avatar && (
					<div className="flex items-center gap-4 mt-5 justify-between">
						<Button
							varient="outline"
							size="default"
							onClick={handleCancel}
							disabled={isLoadingPic}
						>
							Cancel
						</Button>
						<Button
							varient="default"
							size="default"
							disabled={isLoadingPic}
							onClick={handleSavePicture}
							className="gap-2"
						>
							{isLoadingPic && (
								<Loader
									width="1rem"
									height="1rem"
									color="white"
								/>
							)}
							{isLoadingPic ? "Saving..." : "Save"}
						</Button>
					</div>
				)}
			</div>
			<div className="w-[50%]">
				<div className="flex items-center justify-between">
					<h2>Personal Details</h2>
					<Button
						varient="link"
						size="default"
						onClick={() => setEditing((prev) => !prev)}
						disabled={isLoadingInfo}
					>
						{editing ? "Cancel" : "Edit"}
					</Button>
				</div>
				<FormProvider {...methods}>
					<form
						className="flex flex-col gap-2 py-4 pr-10"
						onSubmit={methods.handleSubmit(
							handleUpdatePersonalInfo
						)}
					>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Label
								htmlFor="username"
								className={`${
									editing
										? "text-black"
										: "text-mutedForeground"
								}`}
							>
								Username
							</Label>
							<Input
								autoComplete="off"
								id="username"
								name="username"
								type="text"
								placeholder="Naveed"
								required={true}
								disabled={!editing || isLoadingInfo}
							/>
							{methods.formState?.errors?.username && (
								<Message error={true}>
									{
										methods.formState?.errors?.username
											?.message
									}
								</Message>
							)}
						</div>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Label
								htmlFor="email"
								className={`${
									editing
										? "text-black"
										: "text-mutedForeground"
								}`}
							>
								Email
							</Label>
							<Input
								autoComplete="off"
								id="email"
								name="email"
								type="email"
								placeholder="naveed@gmail.com"
								required={true}
								disabled={!editing || isLoadingInfo}
							/>
							{methods.formState?.errors?.email && (
								<Message error={true}>
									{methods.formState?.errors?.email?.message}
								</Message>
							)}
						</div>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Label
								htmlFor="phone"
								className={`${
									editing
										? "text-black"
										: "text-mutedForeground"
								}`}
							>
								Phone
							</Label>
							<Input
								autoComplete="off"
								id="phone"
								name="phone"
								type="number"
								placeholder="919*****18"
								disabled={!editing || isLoadingInfo}
							/>
						</div>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Message
								error={false}
								className={`${
									editing
										? "text-black"
										: "text-mutedForeground"
								}`}
							>
								Gender
							</Message>
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2">
									<Label
										htmlFor="male"
										className={`${
											editing
												? "text-black"
												: "text-mutedForeground"
										}`}
									>
										Male
									</Label>
									<input
										autoComplete="off"
										id="male"
										type="radio"
										value="male"
										{...methods.register("gender")}
										disabled={!editing || isLoadingInfo}
										defaultChecked={
											userState?.gender === "male"
										}
									/>
								</div>
								<div className="flex items-center gap-2">
									<Label
										htmlFor="female"
										className={`${
											editing
												? "text-black"
												: "text-mutedForeground"
										}`}
									>
										Female
									</Label>
									<input
										autoComplete="off"
										id="female"
										type="radio"
										value="female"
										{...methods.register("gender")}
										disabled={!editing || isLoadingInfo}
										defaultChecked={
											userState?.gender === "female"
										}
									/>
								</div>
							</div>
						</div>
						{editing && (
							<Button
								varient="default"
								size="default"
								type="submit"
								className="gap-2"
							>
								{isLoadingInfo && (
									<Loader
										width="1rem"
										height="1rem"
										color="white"
									/>
								)}
								{isLoadingInfo ? "Updating..." : "Update"}
							</Button>
						)}
					</form>
				</FormProvider>
			</div>
		</div>
	);
};

export default Info;
