import React from 'react';
import Button from './ui/Button';
import { XIcon } from './icons/Icons';

interface ReportFiltersProps {
    filters: {
        searchQuery: string;
        fromDate: string;
        toDate: string;
        serviceType: string;
        installedBy: string;
    };
    onFilterChange: (filters: any) => void;
    installers: string[];
}

const ReportFilters: React.FC<ReportFiltersProps> = ({ filters, onFilterChange, installers }) => {
    const handleInputChange = (field: string, value: string) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const clearField = (field: string) => {
        onFilterChange({ ...filters, [field]: '' });
    };

    const clearAllFilters = () => {
        onFilterChange({
            searchQuery: '',
            fromDate: '',
            toDate: '',
            serviceType: '',
            installedBy: ''
        });
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '');

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Filter Reports</h2>
                {hasActiveFilters && (
                    <Button onClick={clearAllFilters} variant="outline" className="text-sm">
                        Clear All Filters
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Search</label>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="License No, Name, or Mobile..."
                            value={filters.searchQuery}
                            onChange={(e) => handleInputChange('searchQuery', e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 shadow-sm"
                        />
                        {filters.searchQuery && (
                            <button
                                onClick={() => clearField('searchQuery')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                title="Clear"
                            >
                                <XIcon />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={filters.fromDate}
                            onChange={(e) => handleInputChange('fromDate', e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 shadow-sm"
                        />
                        {filters.fromDate && (
                            <button
                                onClick={() => clearField('fromDate')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                title="Clear"
                            >
                                <XIcon />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={filters.toDate}
                            onChange={(e) => handleInputChange('toDate', e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 shadow-sm"
                        />
                        {filters.toDate && (
                            <button
                                onClick={() => clearField('toDate')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                title="Clear"
                            >
                                <XIcon />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Service Type</label>
                    <div className="relative">
                        <select
                            value={filters.serviceType}
                            onChange={(e) => handleInputChange('serviceType', e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 shadow-sm appearance-none"
                        >
                            <option value="">All Types</option>
                            <option value="New">New</option>
                            <option value="Renewal">Renewal</option>
                        </select>
                        {filters.serviceType && (
                            <button
                                onClick={() => clearField('serviceType')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition z-10"
                                title="Clear"
                            >
                                <XIcon />
                            </button>
                        )}
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-1">Installed By</label>
                    <div className="relative">
                        <select
                            value={filters.installedBy}
                            onChange={(e) => handleInputChange('installedBy', e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-300 shadow-sm appearance-none"
                        >
                            <option value="">All Installers</option>
                            {installers.map(installer => (
                                <option key={installer} value={installer}>{installer}</option>
                            ))}
                        </select>
                        {filters.installedBy && (
                            <button
                                onClick={() => clearField('installedBy')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition z-10"
                                title="Clear"
                            >
                                <XIcon />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportFilters;
