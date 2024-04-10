import { useFormContext } from "react-hook-form";

interface InputProps {
	type: "text" | "password" | "email" | "number" | "radio";
	id: string;
	name: string;
	placeholder?: string;
	autoComplete: "off" | "on";
	required?: boolean;
	pattern?: string;
	className?: string;
	disabled?: boolean;
	defaultValue?: string | number;
}

const Input: React.FC<InputProps> = ({
	type,
	id,
	name,
	placeholder,
	autoComplete,
	required,
	pattern,
	className,
	disabled,
	defaultValue,
}) => {
	const { register } = useFormContext();

	const inputClasses =
		"flex w-full h-10 rounded-md border border-mutedForeground focus:border-blue bg-transparent px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none transition duration-300 focus:shadow-inputFocus hover:shadow-inputHover disabled:cursor-not-allowed disabled:opacity-50";
	return (
		<input
			type={type}
			id={id}
			{...register(name, { required })}
			placeholder={placeholder}
			className={`${inputClasses} ${className ? className : ""}`}
			autoComplete={autoComplete}
			pattern={pattern}
			disabled={disabled}
			defaultValue={defaultValue}
		/>
	);
};

export default Input;
