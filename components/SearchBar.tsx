import React from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </span>
            <input
                type="text"
                placeholder="Search by License No, Name, or Mobile..."
                onChange={(e) => onSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 shadow-sm"
            />
        </div>
    );
};

export default SearchBar;