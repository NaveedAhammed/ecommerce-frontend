import { useEffect, useRef, useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";

import Button from "../components/Button";
import Label from "../components/Label";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { privateAxios } from "../utils/axios";
import toast from "react-hot-toast";
import useUserContext from "../hooks/useUserContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContextType } from "../context/UserContext";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Input from "../components/Input";
import { errorHandler } from "../utils/errorHandler";

interface IFormInput {
	usernameOrEmail: string;
	password: string;
}

// yup schema
const schema = yup.object().shape({
	usernameOrEmail: yup.string().required("Username or Email is a required"),
	password: yup.string().required("Password is a required"),
});

const Login = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const methods = useForm<IFormInput>({ resolver: yupResolver(schema) });

	const usernameOrEmailRef = useRef<HTMLInputElement>(null);

	const { setUserState, userState } = useUserContext() as UserContextType;

	const navigate = useNavigate();

	const { state: locationState } = useLocation();

	const onSubmit: SubmitHandler<IFormInput> = (formData: IFormInput) => {
		setIsLoading(true);
		privateAxios
			.post("/login", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error("Login failed, Please try again");
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
		if (usernameOrEmailRef.current) {
			usernameOrEmailRef.current.focus();
		}
	}, []);

	useEffect(() => {
		if (userState) {
			if (locationState) {
				const { redirect } = locationState;
				console.log(redirect);
				return navigate(`${redirect.pathname}${redirect.search}`);
			}
			navigate("/");
		}
	}, [userState, navigate, locationState]);

	return (
		<div className="h-full min-h-[100vh] flex items-center justify-center w-full">
			<div className="w-[28rem] p-8 rounded-md shadow-2xl">
				<h1 className="text-3xl font-bold">Login</h1>
				<p className="mb-8">to continue to Ecommerce Store</p>
				<FormProvider {...methods}>
					<form
						className="w-full"
						onSubmit={methods.handleSubmit(onSubmit)}
					>
						<div className="flex flex-col items-start gap-1 mb-4">
							<Label htmlFor="usernameOrEmail">
								Username or Email
							</Label>
							<Input
								autoComplete="off"
								id="usernameOrEmail"
								name="usernameOrEmail"
								type="text"
								placeholder="Naveed"
								required={true}
								disabled={isLoading}
							/>
							{methods.formState.errors.usernameOrEmail && (
								<Message
									error={true}
									className="hidden peer-invalid:block"
								>
									{
										methods.formState.errors.usernameOrEmail
											.message
									}
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
							{methods.formState.errors?.password && (
								<Message
									error={true}
									className="hidden peer-has-[:invalid]:block"
								>
									{methods.formState.errors.password.message}
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
				<div className="w-full text-right mt-4 hover:underline cursor-pointer">
					Forgot password?
				</div>
				<div className="w-full mt-4 flex items-center justify-center gap-2">
					<span className="">Don&apos;t have an account?</span>
					<Link to="/register" className="hover:underline">
						Register
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Login;
