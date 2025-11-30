import React, { useState, useEffect, useMemo } from 'react';
import { Customer } from '../types';
import { getCustomers } from '../api/customer';
import CustomerTable from '../components/CustomerTable';
import CustomerModal from '../components/CustomerModal';
import AddServiceHistoryModal from '../components/AddServiceHistoryModal';
import ViewServiceHistoryModal from '../components/ViewServiceHistoryModal';
import Button from '../components/ui/Button';
import { Toaster, toast } from '../components/Toaster';
import { updateCustomer, addServiceHistory, getServiceHistoryByCustomer } from '../api/customer';
import ReportFilters from '../components/ReportFilters';

interface ReportsProps {
    onNavigateToDashboard: () => void;
}

const Reports: React.FC<ReportsProps> = ({ onNavigateToDashboard }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState<boolean>(false);
    const [isViewHistoryModalOpen, setIsViewHistoryModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

    const [filters, setFilters] = useState({
        searchQuery: '',
        fromDate: '',
        toDate: '',
        serviceType: '',
        installedBy: ''
    });

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) {
                console.error("Failed to fetch customers:", error);
                toast.error("Failed to load customer data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchServiceHistory = async () => {
            if (!selectedCustomer) return;
            try {
                const data = await getServiceHistoryByCustomer(selectedCustomer.licenseNumber);
                setSelectedCustomer(prev => prev ? { ...prev, serviceHistory: data } : null);
            } catch (error) {
                console.error("Failed to fetch service history:", error);
                toast.error("Failed to load service history data.");
            }
        };
        fetchServiceHistory();
    }, [modalMode]);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const searchLower = filters.searchQuery.toLowerCase();
            const matchesSearch = !filters.searchQuery ||
                customer.licenseNumber.toLowerCase().includes(searchLower) ||
                customer.name.toLowerCase().includes(searchLower) ||
                customer.mobile1.includes(filters.searchQuery) ||
                (customer.mobile2 && customer.mobile2.includes(filters.searchQuery));

            const customerDate = new Date(customer.installedOn);
            const matchesFromDate = !filters.fromDate || customerDate >= new Date(filters.fromDate);
            const matchesToDate = !filters.toDate || customerDate <= new Date(filters.toDate);

            const matchesServiceType = !filters.serviceType || customer.serviceType === filters.serviceType;

            const matchesInstalledBy = !filters.installedBy ||
                customer.installedBy.toLowerCase().includes(filters.installedBy.toLowerCase());

            return matchesSearch && matchesFromDate && matchesToDate && matchesServiceType && matchesInstalledBy;
        });
    }, [customers, filters]);

    const uniqueInstallers = useMemo(() => {
        const installers = new Set(customers.map(c => c.installedBy));
        return Array.from(installers).sort();
    }, [customers]);

    const openModal = async (customer: Customer, mode: 'view' | 'edit') => {
        setSelectedCustomer(customer);
        setModalMode(mode);
        setIsCustomerModalOpen(true);
    };

    const closeModal = () => {
        setIsCustomerModalOpen(false);
        setIsAddServiceModalOpen(false);
        setIsViewHistoryModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleUpdateCustomer = async (updatedCustomer: Customer) => {
        try {
            const result = await updateCustomer(updatedCustomer.licenseNumber, updatedCustomer);
            setCustomers(customers.map(c => c.licenseNumber === result.licenseNumber ? result : c));
            closeModal();
            toast.success("Customer details updated successfully!");
        } catch (error) {
            console.error("Failed to update customer:", error);
            toast.error("Failed to update customer details.");
        }
    };

    const handleAddServiceHistory = async (serviceHistory: Omit<Customer['serviceHistory'][0], 'id' | 'date'>) => {
        if (!selectedCustomer) return;
        try {
            const newHistory = await addServiceHistory(selectedCustomer.licenseNumber, serviceHistory);
            const updatedCustomers = customers.map(c => {
                if (c.licenseNumber === selectedCustomer.licenseNumber) {
                    return { ...c, serviceHistory: [...(c.serviceHistory || []), newHistory] };
                }
                return c;
            });
            setCustomers(updatedCustomers);
            setSelectedCustomer(prev => prev ? { ...prev, serviceHistory: [...(prev.serviceHistory || []), newHistory] } : null);
            setIsAddServiceModalOpen(false);
            toast.success("Service history added successfully!");
        } catch (error) {
            console.error("Failed to add service history:", error);
            toast.error("Failed to add service history.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800">
            <Toaster />
            <header className="bg-gradient-to-br from-primary to-accent text-white shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 my-4">
                    <div className="flex items-center justify-between py-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Reports Dashboard</h1>
                            <p className="mt-2 text-indigo-200 text-lg">Advanced filtering and reporting for customer data.</p>
                        </div>
                        <Button onClick={onNavigateToDashboard} variant="neutral" className="hidden sm:flex">
                            Back to Dashboard
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12 md:-mt-20">
                <ReportFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    installers={uniqueInstallers}
                />

                {loading ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-slate-500">Loading customers...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                            <p className="text-sm text-slate-600">
                                Showing <span className="font-bold text-primary">{filteredCustomers.length}</span> of <span className="font-bold">{customers.length}</span> customers
                            </p>
                        </div>
                        <CustomerTable
                            customers={filteredCustomers}
                            onAction={openModal}
                            totalCustomers={customers.length}
                        />
                    </>
                )}
            </main>

            {isCustomerModalOpen && selectedCustomer && (
                <CustomerModal
                    customer={selectedCustomer}
                    isOpen={isCustomerModalOpen}
                    onClose={closeModal}
                    onSave={handleUpdateCustomer}
                    mode={modalMode}
                    setMode={setModalMode}
                    onAddService={() => setIsAddServiceModalOpen(true)}
                    onViewHistory={() => setIsViewHistoryModalOpen(true)}
                />
            )}

            {isAddServiceModalOpen && selectedCustomer && (
                <AddServiceHistoryModal
                    isOpen={isAddServiceModalOpen}
                    onClose={() => setIsAddServiceModalOpen(false)}
                    onSubmit={handleAddServiceHistory}
                />
            )}

            {isViewHistoryModalOpen && selectedCustomer && (
                <ViewServiceHistoryModal
                    isOpen={isViewHistoryModalOpen}
                    onClose={() => setIsViewHistoryModalOpen(false)}
                    history={selectedCustomer.serviceHistory || []}
                />
            )}
        </div>
    );
};

export default Reports;
