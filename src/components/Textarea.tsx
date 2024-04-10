import { useFormContext } from "react-hook-form";

interface TextareaProps {
	id: string;
	name: string;
	placeholder?: string;
	autoComplete: "off" | "on";
	required?: boolean;
	className?: string;
	disabled?: boolean;
	defaultValue?: string | number;
	rows: number;
	cols: number;
}

const Textarea: React.FC<TextareaProps> = ({
	id,
	name,
	placeholder,
	autoComplete,
	required,
	className,
	disabled,
	defaultValue,
	cols,
	rows,
}) => {
	const { register } = useFormContext();

	const textareaClasses =
		"flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-mutedForeground focus-visible:outline-none transition duration-300 focus:shadow-inputFocus hover:shadow-inputHover disabled:cursor-not-allowed disabled:opacity-50";
	return (
		<textarea
			id={id}
			{...register(name, { required })}
			placeholder={placeholder}
			className={`${textareaClasses} ${
				className ? className : ""
			} resize-none`}
			autoComplete={autoComplete}
			required={required}
			disabled={disabled}
			defaultValue={defaultValue}
			cols={cols}
			rows={rows}
		></textarea>
	);
};

export default Textarea;
