
import React, { useState } from 'react';
import { ServiceHistory } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';

interface AddServiceHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (serviceHistory: Omit<ServiceHistory, 'id' | 'date'>) => void;
}

type FormData = Omit<ServiceHistory, 'id' | 'date'>;

const AddServiceHistoryModal: React.FC<AddServiceHistoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const initialState: FormData = {
        employeeName: '',
        serviceType: 'Maintenance',
        status: 'Completed',
        collectionAmount: 0,
        problemDescription: '',
        solution: '',
    };
    const [formData, setFormData] = useState<FormData>(initialState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData(initialState);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Service Record">
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <Input label="Employee Name" name="employeeName" value={formData.employeeName} onChange={handleChange} required />
                <div>
                    <label className="block text-sm font-medium text-gray-700">Service Type</label>
                    <select name="serviceType" value={formData.serviceType} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option>Installation</option>
                        <option>Maintenance</option>
                        <option>Repair</option>
                        <option>Check-up</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md">
                        <option>Completed</option>
                        <option>In Progress</option>
                        <option>Pending</option>
                    </select>
                </div>
                <Input label="Collection Amount" name="collectionAmount" type="number" value={String(formData.collectionAmount)} onChange={handleChange} required />
                <Textarea label="Problem Description" name="problemDescription" value={formData.problemDescription} onChange={handleChange} required />
                <Textarea label="Solution" name="solution" value={formData.solution} onChange={handleChange} required />
                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" onClick={onClose} variant="danger">Cancel</Button>
                    <Button type="submit" variant="success">Submit</Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddServiceHistoryModal;
