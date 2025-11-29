import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Customer, ServiceHistory } from './types';
import { getCustomers, updateCustomer, addServiceHistory, addCustomer, getServiceHistoryByCustomer } from './api/customer';
import CustomerTable from './components/CustomerTable';
import SearchBar from './components/SearchBar';
import CustomerModal from './components/CustomerModal';
import AddCustomerModal from './components/AddCustomerModal';
import AddServiceHistoryModal from './components/AddServiceHistoryModal';
import ViewServiceHistoryModal from './components/ViewServiceHistoryModal';
import Button from './components/ui/Button';
import { UserPlusIcon } from './components/icons/Icons';
import { Toaster, toast } from './components/Toaster';

const DashboardIllustration: React.FC = () => (
    <svg width="220" height="180" viewBox="0 0 550 450" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="2" result="offsetblur" />
                <feComponentTransfer>
                    <feFuncA type="linear" slope="0.5" />
                </feComponentTransfer>
                <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <rect x="50" y="50" width="450" height="350" rx="30" fill="url(#cardGrad)" filter="url(#shadow)" />

        <rect x="70" y="70" width="410" height="40" rx="10" fill="rgba(255,255,255,0.2)" />
        <circle cx="90" cy="90" r="8" fill="#ef4444" />
        <circle cx="115" cy="90" r="8" fill="#f59e0b" />
        <circle cx="140" cy="90" r="8" fill="#22c55e" />

        <rect x="70" y="130" width="120" height="250" rx="10" fill="rgba(255,255,255,0.2)" />
        <rect x="85" y="150" width="90" height="15" rx="5" fill="rgba(255,255,255,0.4)" />
        <rect x="85" y="180" width="70" height="15" rx="5" fill="rgba(255,255,255,0.3)" />
        <rect x="85" y="210" width="80" height="15" rx="5" fill="rgba(255,255,255,0.3)" />

        <rect x="210" y="130" width="270" height="150" rx="10" fill="rgba(255,255,255,0.2)" />
        <rect x="230" y="190" width="30" height="70" rx="5" fill="#22d3ee" />
        <rect x="270" y="160" width="30" height="100" rx="5" fill="#ffffff" />
        <rect x="310" y="210" width="30" height="50" rx="5" fill="#22d3ee" />
        <rect x="350" y="180" width="30" height="80" rx="5" fill="#ffffff" />
        <rect x="390" y="220" width="30" height="40" rx="5" fill="#22d3ee" />

        <rect x="210" y="300" width="125" height="80" rx="10" fill="rgba(255,255,255,0.2)" />
        <rect x="355" y="300" width="125" height="80" rx="10" fill="rgba(255,255,255,0.2)" />

        <style>
            {`.text-style { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }`}
        </style>
        <text x="220" y="335" fill="#ffffff" fontSize="14" className="text-style">Revenue</text>
        <text x="220" y="360" fill="#ffffff" fontSize="20" fontWeight="bold" className="text-style">$12.4K</text>
        <text x="365" y="335" fill="#ffffff" fontSize="14" className="text-style">Users</text>
        <text x="365" y="360" fill="#ffffff" fontSize="20" fontWeight="bold" className="text-style">1.2K</text>
    </svg>
);


const App: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    console.log("selectedCustomer", selectedCustomer);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState<boolean>(false);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState<boolean>(false);
    const [isViewHistoryModalOpen, setIsViewHistoryModalOpen] = useState<boolean>(false);
    const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState<boolean>(false);
    const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');

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
            try {
                const data = await getServiceHistoryByCustomer(selectedCustomer?.licenseNumber || '');
                console.log("data", data);
                setSelectedCustomer(prev => ({ ...prev, serviceHistory: data }));
            } catch (error) {
                console.error("Failed to fetch service history:", error);
                toast.error("Failed to load service history data.");
            } finally {
                setLoading(false);
            }
        };
        fetchServiceHistory();
    }, [modalMode]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const filteredCustomers = useMemo(() => {
        if (!searchQuery) {
            return customers;
        }
        return customers.filter(customer =>
            customer.licenseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.mobile1.includes(searchQuery) ||
            (customer.mobile2 && customer.mobile2.includes(searchQuery))
        );
    }, [customers, searchQuery]);

    const openModal = useCallback(async (customer: Customer, mode: 'view' | 'edit') => {
        setSelectedCustomer(customer);
        setModalMode(mode);
        setIsCustomerModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsCustomerModalOpen(false);
        setIsAddServiceModalOpen(false);
        setIsViewHistoryModalOpen(false);
        setIsAddCustomerModalOpen(false);
        setSelectedCustomer(null);
    }, []);

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

    const handleAddCustomer = async (newCustomerData: Omit<Customer, 'serviceHistory'>) => {
        try {
            const result = await addCustomer(newCustomerData);
            setCustomers(prev => [result, ...prev]);
            closeModal();
            toast.success("Customer added successfully!");
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to add customer.";
            console.error("Failed to add customer:", errorMessage);
            toast.error(errorMessage);
        }
    };

    const handleAddServiceHistory = async (serviceHistory: Omit<ServiceHistory, 'id' | 'date'>) => {
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
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-8">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Customer Dashboard</h1>
                            <p className="mt-2 text-indigo-200 text-lg">Manage your customer data with ease.</p>
                        </div>
                        <div className="hidden lg:block">
                            <DashboardIllustration />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-12 md:-mt-20">
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-grow w-full">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <Button onClick={() => setIsAddCustomerModalOpen(true)} variant="primary" className="w-full sm:w-auto flex-shrink-0">
                        <UserPlusIcon />
                        <span>Add Customer</span>
                    </Button>
                </div>
                {loading ? (
                    <div className="text-center py-10">
                        <p className="text-lg text-slate-500">Loading customers...</p>
                    </div>
                ) : (
                    <CustomerTable customers={filteredCustomers} onAction={openModal} totalCustomers={customers.length} />
                )}
            </main>

            <AddCustomerModal
                isOpen={isAddCustomerModalOpen}
                onClose={closeModal}
                onSubmit={handleAddCustomer}
            />

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

export default App;