import React from 'react';
import { Customer } from '../types';
import { DASHBOARD_COLUMNS } from '../constants';
import { EyeIcon, PencilIcon, NoDataIcon, SearchIconLarge } from './icons/Icons';
import EmptyState from './ui/EmptyState';

interface CustomerTableProps {
    customers: Customer[];
    onAction: (customer: Customer, mode: 'view' | 'edit') => void;
    totalCustomers: number;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onAction, totalCustomers }) => {
    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-100">
                        <tr>
                            {DASHBOARD_COLUMNS.map(col => (
                                <th key={col.key} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    {col.label}
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {customers.length > 0 ? customers.map((customer) => (
                            <tr key={customer.licenseNumber} className="hover:bg-slate-50 transition duration-150">
                                {DASHBOARD_COLUMNS.map(col => (
                                    <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                        {(() => {
                                            const value = customer[col.key];
                                            if (Array.isArray(value)) {
                                                return `${value.length} record(s)`;
                                            }

                                            // If column is installedOn → format date
                                            if (col.key === 'installedOn' && value) {
                                                const formatted = new Date(value).toISOString().split('T')[0];
                                                return formatted; // YYYY-MM-DD
                                            }
                                            return value || 'N/A';
                                        })()}
                                    </td>
                                ))}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                                    <div className="flex items-center justify-center space-x-4">
                                        <button onClick={() => onAction(customer, 'view')} className="text-blue-600 hover:text-blue-800 transition duration-150" title="View Details">
                                            <EyeIcon />
                                        </button>
                                        <button onClick={() => onAction(customer, 'edit')} className="text-green-600 hover:text-green-800 transition duration-150" title="Edit Details">
                                            <PencilIcon />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={DASHBOARD_COLUMNS.length + 1}>
                                    {totalCustomers > 0 ? (
                                        <EmptyState
                                            Icon={SearchIconLarge}
                                            title="No customers found"
                                            description="Your search did not match any customers. Try different keywords."
                                        />
                                    ) : (
                                        <EmptyState
                                            Icon={NoDataIcon}
                                            title="No customers yet"
                                            description="There are no customer records to display."
                                        />
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CustomerTable;