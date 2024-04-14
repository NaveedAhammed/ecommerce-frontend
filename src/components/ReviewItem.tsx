import { TiStar } from "react-icons/ti";
import { IReview } from "../types";
import { GoPerson } from "react-icons/go";
import { getTimeAgo } from "../utils/getTimesAgo";

const ReviewItem: React.FC<{ item: IReview; isLast: boolean }> = ({
	item,
	isLast,
}) => {
	return (
		<div
			className={`w-full flex flex-col p-6 gap-3 ${
				isLast ? "" : "border-b"
			}`}
		>
			<div className="flex items-center gap-3">
				<div className="w-6 h-6 rounded-full shadow-sm flex items-center justify-center overflow-hidden border">
					{item.userId.avatar ? (
						<img
							src={item.userId.avatar}
							alt={item.userId.username}
							className="w-full h-full rounded-[999px]"
						/>
					) : (
						<GoPerson className="rounded-[999px]" />
					)}
				</div>
				<span className="text-base font-semibold">
					{item.userId.username}
				</span>
				<span className="text-sm text-mutedForeground">
					{getTimeAgo(item.postedAt)}
				</span>
			</div>
			<div className="flex gap-2">
				<div className="bg-green-700 text-white px-[6px] font-bold text-xs rounded-md flex items-center">
					{item.numRating} <TiStar />
				</div>
				<p className="text-sm">{item.comment}</p>
			</div>
		</div>
	);
};

export default ReviewItem;
