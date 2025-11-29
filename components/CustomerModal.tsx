import React, { useState, useEffect } from 'react';
import { Customer } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import { PencilIcon, PlusIcon, HistoryIcon, CheckIcon, BanIcon } from './icons/Icons';

interface CustomerModalProps {
    customer: Customer;
    isOpen: boolean;
    onClose: () => void;
    onSave: (customer: Customer) => void;
    mode: 'view' | 'edit';
    setMode: (mode: 'view' | 'edit') => void;
    onAddService: () => void;
    onViewHistory: () => void;
}

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, isOpen, onClose, onSave, mode, setMode, onAddService, onViewHistory }) => {

    console.log("customer", customer);
    const [formData, setFormData] = useState<Customer>(customer);

    useEffect(() => {
        setFormData(customer);
    }, [customer, mode]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as 'New' | 'Renewal' }));
    }

    const handleSave = () => {
        onSave(formData);
        setMode('view');
    };

    const handleCancelEdit = () => {
        setFormData(customer);
        setMode('view');
    }

    const isViewMode = mode === 'view';

    const renderField = (label: string, value: string | undefined, fieldName: keyof Customer, type: string = "text", disabled: boolean = false) => (
        <div>
            <label className="block text-sm font-medium text-slate-700">{label}</label>
            {isViewMode || disabled ? (
                <p className="mt-1 text-md text-slate-900 bg-slate-100 p-2 rounded-md min-h-[42px] flex items-center">{value || 'N/A'}</p>
            ) : (
                <Input
                    type={type}
                    name={fieldName}
                    value={value || ''}
                    onChange={handleChange}
                    className="mt-1"
                />
            )}
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isViewMode ? 'Customer Details' : 'Edit Customer'}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {renderField('License Number', formData.licenseNumber, 'licenseNumber', 'text', true)}
                {renderField('Customer Name', formData.name, 'name')}
                {renderField('Month-Year', formData.monthYear, 'monthYear')}
                {renderField('Address', formData.address, 'address')}
                {renderField('Mobile 1', formData.mobile1, 'mobile1')}
                {renderField('Mobile 2', formData.mobile2, 'mobile2')}
                {renderField('Installed By', formData.installedBy, 'installedBy')}
                <div>
                    <label className="block text-sm font-medium text-slate-700">Service Type</label>
                    {isViewMode ? (
                        <p className="mt-1 text-md text-slate-900 bg-slate-100 p-2 rounded-md min-h-[42px] flex items-center">{formData.serviceType}</p>
                    ) : (
                        <select name="serviceType" value={formData.serviceType} onChange={handleSelectChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>New</option>
                            <option>Renewal</option>
                        </select>
                    )}
                </div>
                {renderField('Installed On', formData.installedOn, 'installedOn', 'date')}
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-between items-center">
                {isViewMode ? (
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={() => setMode('edit')} variant="primary">
                            <PencilIcon />
                            <span>Edit</span>
                        </Button>
                        <Button onClick={onAddService} variant="secondary">
                            <PlusIcon />
                            <span>Add Service</span>
                        </Button>
                        <Button onClick={onViewHistory} variant="outline" disabled={!customer.serviceHistory || customer.serviceHistory.length === 0}>
                            <HistoryIcon />
                            <span>View History</span>
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <Button onClick={handleSave} variant="success">
                            <CheckIcon />
                            <span>Save Changes</span>
                        </Button>
                        <Button onClick={handleCancelEdit} variant="danger">
                            <BanIcon />
                            <span>Cancel</span>
                        </Button>
                    </div>
                )}
                <Button onClick={onClose} variant="neutral">Close</Button>
            </div>
        </Modal>
    );
};

export default CustomerModal;