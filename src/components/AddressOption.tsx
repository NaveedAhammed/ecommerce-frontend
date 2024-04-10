import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";

import Button from "./Button";
import { IShippingInfo } from "../types";

const AddressOption: React.FC<{
	shippingInfo: IShippingInfo;
	setData: (shippingInfo: IShippingInfo) => void;
	isSelected: boolean;
	setSelectedAddress: React.Dispatch<
		React.SetStateAction<IShippingInfo | null>
	>;
	setStep: React.Dispatch<React.SetStateAction<number>>;
	index: number;
}> = ({ shippingInfo, setData, isSelected, setSelectedAddress, setStep }) => {
	return (
		<div
			className={`flex gap-4 items-start w-full p-4 border-b ${
				isSelected ? "bg-gray-100" : "bg-white"
			}`}
			onClick={() => setSelectedAddress(shippingInfo)}
		>
			{isSelected ? (
				<MdRadioButtonChecked size={22} className="mt-4" />
			) : (
				<MdRadioButtonUnchecked size={22} className="mt-4" />
			)}
			<div className="flex-1">
				<div className="w-full flex items-center justify-between">
					<div className="w-full flex items-center gap-4 text-sm font-semibold">
						<span className="px-2 py-1 bg-gray-100 rounded-md text-[10px] uppercase shadow-md">
							{shippingInfo?.addressType}
						</span>
						<span>{shippingInfo?.name}</span>
						<span>{shippingInfo?.phone}</span>
					</div>
					<Button
						varient="link"
						size="icon"
						onClick={() => setData(shippingInfo)}
						className="relative"
					>
						Edit
					</Button>
				</div>
				<p className="w-[60%] text-sm font-light">
					{`${shippingInfo?.address}, ${shippingInfo?.city}(City.), ${shippingInfo?.state} - ${shippingInfo?.pincode}`}
				</p>
				{isSelected && (
					<Button
						size="default"
						varient="default"
						onClick={() => setStep(2)}
						className="mt-6"
					>
						Deliver Here
					</Button>
				)}
			</div>
		</div>
	);
};

export default AddressOption;
