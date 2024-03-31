import { useState } from "react";
import Button from "./Button";
import { IoMdMore } from "react-icons/io";
import { IShippingInfo } from "../types";

const AddressItem: React.FC<{
	shippingInfo: IShippingInfo;
	setData: (shippingInfo: IShippingInfo) => void;
	deleteAddress: (shippingAddressId: string | undefined) => void;
}> = ({ shippingInfo, setData, deleteAddress }) => {
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="flex flex-col gap-1 w-full p-4 border-b">
			<div className="w-full flex items-center justify-between">
				<span className="p-2 bg-gray-100 rounded-md text-[10px] uppercase tracking-widest">
					{shippingInfo?.addressType}
				</span>
				<Button
					varient="ghost"
					size="icon"
					onClick={() => setIsOpen((prev) => !prev)}
					className="relative"
				>
					<IoMdMore size={24} />
					{isOpen && (
						<div className="flex flex-col absolute top-[110%] right-0 bg-white shadow-md border rounded-md w-20 items-start">
							<span
								className="w-full border-b py-2 text-start px-3 hover:bg-gray-100"
								onClick={() => setData(shippingInfo)}
							>
								Edit
							</span>
							<span
								className="w-full py-2 text-start px-3 hover:bg-gray-100"
								onClick={() => deleteAddress(shippingInfo._id)}
							>
								Delete
							</span>
						</div>
					)}
				</Button>
			</div>
			<div className="w-full flex items-center gap-6 text-sm font-semibold">
				<span>{shippingInfo?.name}</span>
				<span>{shippingInfo?.phone}</span>
			</div>
			<p className="w-[60%] text-sm font-light">
				{`${shippingInfo?.address}, ${shippingInfo?.city}(City.), ${shippingInfo?.state} - ${shippingInfo?.pincode}`}
			</p>
		</div>
	);
};

export default AddressItem;
