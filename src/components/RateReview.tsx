import { useEffect, useState } from "react";

import Button from "./Button";
import Label from "./Label";
import Loader from "./Loader";
import Message from "./Message";
import toast from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { errorHandler } from "../utils/errorHandler";
import Rating from "./Rating";
import Textarea from "./Textarea";
import { Link, useParams } from "react-router-dom";
import { IProduct, IReview } from "../types";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import publicAxios from "../utils/axios";
import useUserContext from "../hooks/useUserContext";
import { UserContextType } from "../context/UserContext";

interface IFormInput {
	comment: string;
}

// yup schema
const schema = yup.object().shape({
	comment: yup.string().required("Review is a required field"),
});

const RateReviewProduct = () => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [product, setProduct] = useState<IProduct | null>(null);
	const { userState } = useUserContext() as UserContextType;
	const [tempRating, setTempRating] = useState(0);
	const [userReview, setUserReview] = useState<IReview | null>(null);
	const [rating, setRating] = useState(0);
	const methods = useForm<IFormInput>({
		resolver: yupResolver(schema),
		defaultValues: {
			comment: userReview?.comment,
		},
	});
	const [isValidRate, setIsValidRate] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const axiosPrivate = useAxiosPrivate();

	const { id } = useParams();

	const onSubmit: SubmitHandler<IFormInput> = (formData: IFormInput) => {
		if (!tempRating && !rating) {
			setIsValidRate(false);
			return;
		}
		setIsSubmitting(true);
		axiosPrivate
			.post(`/product/review/${product?._id}`, {
				...formData,
				numRating: tempRating || rating,
			})
			.then((res) => {
				if (!res.data.success) {
					return toast.error(
						"Something went wrong, Please try again"
					);
				}
				if (res.data.success) {
					return toast.success(res.data.message);
				}
			})
			.catch(errorHandler)
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	useEffect(() => {
		const userReview = product?.reviews.find(
			(it) => it.userId._id === userState?._id
		);
		if (userReview) {
			setUserReview(userReview);
			methods.setValue("comment", userReview.comment);
			setRating(userReview.numRating);
		}
	}, [product, userState?._id, methods]);

	useEffect(() => {
		const getProductDetails = () => {
			setIsLoading(true);
			publicAxios
				.get(`/products/${id}`)
				.then((res) => {
					setProduct(res.data.data.product);
				})
				.catch(errorHandler)
				.finally(() => {
					setIsLoading(false);
				});
		};

		getProductDetails();
	}, [id]);

	if (isLoading) {
		return (
			<div className="w-full h-[90vh] flex items-center justify-center">
				<Loader color="black" height="5rem" width="5rem" />
			</div>
		);
	}

	const onInvalid = () => {
		if (!tempRating && !rating) {
			setIsValidRate(false);
			return;
		}
	};

	return (
		<>
			{product && (
				<div className="h-full min-h-[80vh] flex items-center justify-center w-full">
					<div className="w-[50rem] p-8 rounded-md shadow-2xl">
						<h1 className="text-2xl font-bold mb-6">
							Rating & Review
						</h1>
						<div className="flex gap-4 mb-6">
							<div className="w-28 h-24 rounded-md overflow-hidden border">
								<img
									src={product?.images[0].url}
									alt={product.title}
									className="w-full h-full object-contain"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<Link
									to={`/product/${product._id}`}
									className="text-base w-[95%] hover:underline"
								>
									{product.title}
								</Link>
							</div>
						</div>
						<FormProvider {...methods}>
							<form
								className="w-full"
								onSubmit={methods.handleSubmit(
									onSubmit,
									onInvalid
								)}
							>
								<div className="flex flex-col items-start gap-1 mb-4">
									<Rating
										rating={rating}
										tempRating={tempRating}
										setRating={setRating}
										setTempRating={setTempRating}
										setIsValidRate={setIsValidRate}
									/>
									{!isValidRate && (
										<Message error={true}>
											Rating is a required field
										</Message>
									)}
								</div>
								<div className="flex flex-col items-start gap-1 mb-4">
									<Label htmlFor="email">
										Review this product
									</Label>
									<Textarea
										autoComplete="off"
										cols={30}
										rows={5}
										id="comment"
										name="comment"
										className="col-span-2 bg-white"
										placeholder="Comment"
										disabled={isSubmitting}
									/>
									{methods.formState?.errors?.comment && (
										<Message error={true}>
											{
												methods.formState?.errors
													?.comment?.message
											}
										</Message>
									)}
								</div>
								<Button
									varient="default"
									size="default"
									className="w-full gap-2 mt-4"
									disabled={isSubmitting}
									type="submit"
								>
									{isSubmitting && (
										<Loader
											width="1rem"
											height="1rem"
											color="white"
										/>
									)}
									Submit
								</Button>
							</form>
						</FormProvider>
					</div>
				</div>
			)}
		</>
	);
};

export default RateReviewProduct;
