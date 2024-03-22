import Button from "./Button";

// import { GoPlus } from "react-icons/go";
import { TbAdjustmentsFilled } from "react-icons/tb";

interface HeadingProps {
	title: string;
	action: () => void;
	actionLabel: string;
}

const Heading: React.FC<HeadingProps> = ({ title, action, actionLabel }) => {
	return (
		<div className="flex items-center justify-between w-full py-4 mb-2">
			<h2 className="text-3xl font-medium tracking-tight">{title}</h2>
			<Button
				size="default"
				onClick={action}
				varient="link"
				className="gap-2"
			>
				<TbAdjustmentsFilled />
				{actionLabel}
			</Button>
		</div>
	);
};

export default Heading;
