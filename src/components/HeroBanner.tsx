import { IBillboard } from "../types";

const HeroBanner: React.FC<{ heroBanner: IBillboard | null }> = ({
	heroBanner,
}) => {
	return (
		<div className="my-4 cursor-pointer w-full max-h-[24rem] mb-14">
			<h1></h1>
			<img
				src={heroBanner?.imageUrl}
				alt={heroBanner?.title}
				className="w-full h-full object-cover rounded-md brightness-90"
			/>
		</div>
	);
};

export default HeroBanner;
