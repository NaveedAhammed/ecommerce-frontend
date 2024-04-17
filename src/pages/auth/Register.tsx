import { useEffect, useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/Button";
import Label from "../../components/Label";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { privateAxios } from "../../utils/axios";
import toast from "react-hot-toast";
import useUserContext from "../../hooks/useUserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContextType } from "../../context/UserContext";
import Input from "../../components/Input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { errorHandler } from "../../utils/errorHandler";

interface IFormInput {
	username: string;
	email: string;
	password: string;
}

// yup schema
const schema = yup.object().shape({
	username: yup.string().required("Username is a required field"),
	email: yup
		.string()
		.required("Email is a required field")
		.email("Invaild email"),
	password: yup.string().required("Password is a required field"),
});

const Register = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const methods = useForm<IFormInput>({ resolver: yupResolver(schema) });

	const { setUserState, userState } = useUserContext() as UserContextType;

	const navigate = useNavigate();

	const { state: locationState } = useLocation();

	const onSubmit: SubmitHandler<IFormInput> = (formData: IFormInput) => {
		setIsLoading(true);
		privateAxios
			.post("/register", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error("Register failed, Please try again");
				}
				const { user: userData, accessToken } = res.data.data;
				setUserState({
					_id: userData.id,
					username: userData.username,
					accessToken,
					avatar: userData?.avatar,
					wishlistIds: userData?.wishlistIds || [],
					email: userData?.email,
					phone: userData?.phone,
					gender: userData?.gender,
					cart: userData?.cart || [],
					shippingAddresses: userData?.shippingAddresses || [],
				});
				localStorage.setItem("isLoggedIn", "true");
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		if (userState) {
			if (locationState) {
				const { redirect } = locationState;
				return navigate(`${redirect.pathname}${redirect.search}`);
			}
			navigate("/");
		}
	}, [userState, navigate, locationState]);

	return (
		<div className="h-full min-h-[100vh] flex items-center justify-center w-full">
			<div className="w-full h-[100vh] ssm:h-fit ssm:w-[28rem] flex flex-col justify-center px-4 ssm:p-8 rounded-md shadow-2xl">
				<Button
					varient="link"
					size="default"
					className="absolute top-3 right-3 ssm:hidden"
					onClick={() => navigate("/")}
				>
					Back Home
				</Button>
				<h1 className="text-3xl font-bold">Register</h1>
				<p className="mb-8">to continue to Ecommerce Store</p>
				<FormProvider {...methods}>
					<form
						className="w-full"
						onSubmit={methods.handleSubmit(onSubmit)}
						noValidate
					>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Label htmlFor="username">Username</Label>
							<Input
								autoComplete="off"
								id="username"
								name="username"
								type="text"
								placeholder="Naveed"
								required={true}
								disabled={isLoading}
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
							<Label htmlFor="email">Email</Label>
							<Input
								autoComplete="off"
								id="email"
								name="email"
								type="email"
								placeholder="naveed@gmail.com"
								required={true}
								disabled={isLoading}
							/>
							{methods.formState?.errors?.email && (
								<Message error={true}>
									{methods.formState?.errors?.email?.message}
								</Message>
							)}
						</div>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Label htmlFor="password">Password</Label>
							<div className="flex items-center w-full relative peer">
								<Input
									autoComplete="off"
									id="password"
									name="password"
									type={`${
										isPasswordVisible ? "text" : "password"
									}`}
									placeholder="*******"
									required={true}
									disabled={isLoading}
								/>
								{isPasswordVisible ? (
									<GoEye
										className="absolute right-0 top-[50%] translate-y-[-50%] w-9 py-3 px-2 h-full cursor-pointer"
										onClick={() =>
											setIsPasswordVisible(
												(prev) => !prev
											)
										}
									/>
								) : (
									<GoEyeClosed
										className="absolute right-0 top-[50%] translate-y-[-50%] w-9 py-3 px-2 h-full cursor-pointer"
										onClick={() =>
											setIsPasswordVisible(
												(prev) => !prev
											)
										}
									/>
								)}
							</div>
							{methods.formState?.errors?.password && (
								<Message error={true}>
									{
										methods.formState?.errors?.password
											?.message
									}
								</Message>
							)}
						</div>
						<Button
							varient="default"
							size="default"
							className="w-full gap-2"
							disabled={isLoading}
							type="submit"
						>
							{isLoading && (
								<Loader
									width="1rem"
									height="1rem"
									color="white"
								/>
							)}
							Continue
						</Button>
					</form>
				</FormProvider>
				<div className="w-full mt-4 flex items-center justify-center gap-2">
					<span className="">Already have an account?</span>
					<Link to="/login" className="hover:underline">
						Login
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Register;
