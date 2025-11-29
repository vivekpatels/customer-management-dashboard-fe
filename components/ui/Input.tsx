
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const Input: React.FC<InputProps> = ({ label, name, className, ...props }) => {
    const baseClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none";
    return (
        <div>
            {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>}
            <input id={name} name={name} className={`${baseClasses} ${className}`} {...props} />
        </div>
    );
};

export default Input;
