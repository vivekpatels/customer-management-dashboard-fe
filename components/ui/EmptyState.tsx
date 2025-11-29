import React from 'react';

interface EmptyStateProps {
    Icon: React.FC;
    title: string;
    description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ Icon, title, description }) => {
    return (
        <div className="text-center py-10 px-4">
            <div className="mx-auto h-24 w-24 text-slate-300">
                <Icon />
            </div>
            <h3 className="mt-2 text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
    );
};

export default EmptyState;