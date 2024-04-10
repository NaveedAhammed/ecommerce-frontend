import { useState } from "react";
import { GoEye, GoEyeClosed } from "react-icons/go";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Button from "../../components/Button";
import Label from "../../components/Label";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { privateAxios } from "../../utils/axios";
import toast from "react-hot-toast";
import Input from "../../components/Input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { errorHandler } from "../../utils/errorHandler";
import { useParams } from "react-router-dom";
import { FaRegCheckCircle } from "react-icons/fa";

interface IFormInput {
	password: string;
}

// yup schema
const schema = yup.object().shape({
	password: yup.string().required("Password is a required field"),
});

const ResetPassword = () => {
	const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const { token } = useParams();
	const [success, setSuccess] = useState(false);

	const methods = useForm<IFormInput>({ resolver: yupResolver(schema) });

	const onSubmit: SubmitHandler<IFormInput> = (formData: IFormInput) => {
		setIsLoading(true);
		privateAxios
			.post(`/password/reset/${token}`, formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error("Register failed, Please try again");
				}
				setSuccess(true);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="h-full min-h-[100vh] flex items-center justify-center w-full">
			<div className="w-[28rem] p-8 rounded-md shadow-2xl">
				<h1 className="text-2xl font-bold mb-6">Password Recovery</h1>
				<FormProvider {...methods}>
					<form
						className="w-full"
						onSubmit={methods.handleSubmit(onSubmit)}
						noValidate
					>
						{success && (
							<div className="w-full bg-success/20 text-green-700 rounded-md py-2 px-4 flex items-center justify-center gap-2 my-4">
								<FaRegCheckCircle size={20} />
								<span>Password reset successfull!</span>
							</div>
						)}
						{!success && (
							<>
								<div className="flex flex-col items-start gap-1 mb-4">
									<Label htmlFor="password">
										New Password
									</Label>
									<div className="flex items-center w-full relative peer">
										<Input
											autoComplete="off"
											id="password"
											name="password"
											type={`${
												isPasswordVisible
													? "text"
													: "password"
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
												methods.formState?.errors
													?.password?.message
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
							</>
						)}
					</form>
				</FormProvider>
			</div>
		</div>
	);
};

export default ResetPassword;
