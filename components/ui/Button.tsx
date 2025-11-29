import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline' | 'neutral';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed shadow-sm inline-flex items-center justify-center gap-2';
    
    const variantClasses = {
        primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 focus:ring-primary',
        secondary: 'bg-accent text-white hover:bg-cyan-500 focus:ring-accent',
        success: 'bg-success text-white hover:bg-green-600 focus:ring-success',
        danger: 'bg-error text-white hover:bg-red-600 focus:ring-error',
        outline: 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
        neutral: 'bg-slate-200 text-slate-800 hover:bg-slate-300 focus:ring-slate-400',
    };

    return (
        <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

export default Button;