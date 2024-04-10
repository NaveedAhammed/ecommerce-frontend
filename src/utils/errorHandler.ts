import axios from "axios";
import toast from "react-hot-toast";

export const errorHandler = (err: unknown) => {
	if (err === null) throw new Error("Unrecoverable error!! Error is null!");
	if (axios.isAxiosError<{ message: string }>(err)) {
		console.log(err.code);
		if (err.code === "ERR_NETWORK") {
			console.log("connection problems..");
			toast.error("Network connection problem...");
		} else if (err.code === "ERR_BAD_RESPONSE") {
			toast.error("Something went wrong");
		}
	}
};
