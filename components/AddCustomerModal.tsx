import React, { useState } from 'react';
import { Customer } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';

interface AddCustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (customer: Omit<Customer, 'serviceHistory'>) => void;
}

type FormData = Omit<Customer, 'serviceHistory'>;

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const getInitialState = (): FormData => ({
        licenseNumber: '',
        name: '',
        monthYear: '',
        address: '',
        mobile1: '',
        mobile2: '',
        installedBy: '',
        serviceType: 'New',
        installedOn: new Date().toISOString().split('T')[0],
    });

    const [formData, setFormData] = useState<FormData>(getInitialState());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form after submission only if successful, parent component will handle closing
        // For simplicity here, we assume submission is always successful and parent closes modal
        setFormData(getInitialState()); 
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Customer">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                    <Input label="Customer Name" name="name" value={formData.name} onChange={handleChange} required />
                    <Input label="Month-Year" name="monthYear" value={formData.monthYear} onChange={handleChange} placeholder="MM-YYYY" required />
                    <Input label="Address" name="address" value={formData.address} onChange={handleChange} required/>
                    <Input label="Mobile 1" name="mobile1" value={formData.mobile1} onChange={handleChange} required />
                    <Input label="Mobile 2" name="mobile2" value={formData.mobile2} onChange={handleChange} />
                    <Input label="Installed By" name="installedBy" value={formData.installedBy} onChange={handleChange} required/>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Service Type</label>
                        <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                            <option>New</option>
                            <option>Renewal</option>
                        </select>
                    </div>
                    <Input label="Installed On" name="installedOn" type="date" value={formData.installedOn} onChange={handleChange} required/>
                 </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" onClick={onClose} variant="neutral">Cancel</Button>
                    <Button type="submit" variant="success">Add Customer</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddCustomerModal;
