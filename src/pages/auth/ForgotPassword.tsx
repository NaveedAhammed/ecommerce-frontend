import { useState } from "react";
import { FaRegCheckCircle } from "react-icons/fa";

import Button from "../../components/Button";
import Label from "../../components/Label";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { privateAxios } from "../../utils/axios";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import Input from "../../components/Input";
import { errorHandler } from "../../utils/errorHandler";

interface IFormInput {
	email: string;
}

// yup schema
const schema = yup.object().shape({
	email: yup
		.string()
		.required("Email is a required field")
		.email("Invaild email"),
});

const ForgotPassword = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isEmailSent, setIsEmailSent] = useState(false);

	const methods = useForm<IFormInput>({ resolver: yupResolver(schema) });

	const onSubmit: SubmitHandler<IFormInput> = (formData: IFormInput) => {
		setIsLoading(true);
		privateAxios
			.post("/password/forgot", formData)
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Something went wrong, Please try again"
					);
				}
				setIsEmailSent(true);
			})
			.catch(errorHandler)
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className="h-full min-h-[100vh] flex items-center justify-center w-full">
			<div className="w-[28rem] p-8 rounded-md shadow-2xl">
				<h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
				<FormProvider {...methods}>
					<form
						className="w-full"
						onSubmit={methods.handleSubmit(onSubmit)}
					>
						{isEmailSent && (
							<div className="w-full bg-success/20 text-green-700 rounded-md py-2 px-4 flex items-center justify-center gap-2 my-4">
								<FaRegCheckCircle size={20} />
								<span>Email sent!</span>
							</div>
						)}
						{!isEmailSent && (
							<>
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
											{
												methods.formState?.errors?.email
													?.message
											}
										</Message>
									)}
								</div>
								<Button
									varient="default"
									size="default"
									className="w-full gap-2 mt-4"
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

export default ForgotPassword;
