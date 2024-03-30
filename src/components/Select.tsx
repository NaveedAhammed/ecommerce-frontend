import { useFormContext } from "react-hook-form";

export interface IOption {
	id: string;
	name: string;
}

interface SelectProps {
	options: IOption[];
	name: string;
	id: string;
	required?: boolean;
	className?: string;
	onClick?: () => void;
}

const Select: React.FC<SelectProps> = ({
	options,
	name,
	id,
	required,
	className,
	onClick,
}) => {
	const { register } = useFormContext();

	return (
		<select
			className={`"flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 ${
				className ? className : ""
			}`}
			id={id}
			{...register(name, { required })}
			onClick={onClick}
		>
			<option value="" className="text-base">
				select
			</option>
			{options.map((option) => (
				<option
					className="text-base"
					value={`${option.id}`}
					key={option.id}
				>
					{option.name}
				</option>
			))}
		</select>
	);
};

export default Select;
