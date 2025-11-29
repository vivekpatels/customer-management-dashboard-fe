
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, name, className, ...props }) => {
    const baseClasses = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary";
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
            <textarea id={name} name={name} rows={3} className={`${baseClasses} ${className}`} {...props} />
        </div>
    );
};

export default Textarea;
