import { GoStarFill, GoStar } from "react-icons/go";

const Rating: React.FC<{
	rating: number | undefined;
	tempRating: number;
	setRating: React.Dispatch<React.SetStateAction<number>>;
	setTempRating: React.Dispatch<React.SetStateAction<number>>;
	setIsValidRate: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ rating, tempRating, setRating, setTempRating, setIsValidRate }) => {
	console.log(rating);
	return (
		<div className="flex flex-col gap-2">
			<span>Rate this product</span>
			<div className="flex items-center">
				{Array.from({ length: 5 }, (_, i) => (
					<Star
						onRate={() => {
							setRating(i + 1);
							setIsValidRate(true);
						}}
						full={
							tempRating
								? tempRating >= i + 1
								: rating
								? rating >= i + 1
								: false
						}
						onHoverIn={() => {
							setTempRating(i + 1);
							setIsValidRate(true);
						}}
						onHoverOut={() => setTempRating(0)}
						key={i}
					/>
				))}
				<span className="ml-3 text-lg">
					{tempRating || rating || ""}
				</span>
			</div>
		</div>
	);
};

const Star: React.FC<{
	onRate: () => void;
	full: boolean;
	onHoverIn: () => void;
	onHoverOut: () => void;
}> = ({ onRate, full, onHoverIn, onHoverOut }) => {
	return full ? (
		<GoStarFill
			onMouseEnter={onHoverIn}
			onMouseLeave={onHoverOut}
			size={45}
			className="text-yellow-400 px-2 cursor-pointer"
			onClick={onRate}
		/>
	) : (
		<GoStar
			size={45}
			onClick={onRate}
			onMouseEnter={onHoverIn}
			onMouseLeave={onHoverOut}
			className="px-2 cursor-pointer"
		/>
	);
};

export default Rating;
