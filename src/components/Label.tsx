interface LabelProps {
	children: React.ReactNode;
	htmlFor: string;
	error?: boolean;
	className?: string;
}

const Label: React.FC<LabelProps> = ({
	children,
	htmlFor,
	error,
	className,
}) => {
	const labelClasses = "font-medium text-sm";
	return (
		<label
			htmlFor={htmlFor}
			className={`${labelClasses} ${
				error ? "text-destructive" : "text-foreground"
			} ${className ? className : ""}`}
		>
			{children}
		</label>
	);
};

export default Label;
