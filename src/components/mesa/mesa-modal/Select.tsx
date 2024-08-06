import React from 'react';

interface SelectProps {
	value: string;
	onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
	children: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, children }) => {
	return (
		<select value={value} onChange={onChange}>
			{children}
		</select>
	);
};

export const SelectOption: React.FC<{ value: string; children: React.ReactNode }> = ({
	value,
	children,
}) => {
	return <option value={value}>{children}</option>;
};
