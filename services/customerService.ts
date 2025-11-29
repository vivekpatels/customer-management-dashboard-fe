import { Customer, ServiceHistory } from '../types';
import { MOCK_CUSTOMERS } from './mockData';

let customers: Customer[] = MOCK_CUSTOMERS;

// Simulate API latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getCustomers = async (): Promise<Customer[]> => {
    await delay(500);
    return JSON.parse(JSON.stringify(customers)); // Return a deep copy
};

export const getCustomerById = async (licenseNumber: string): Promise<Customer | undefined> => {
    await delay(300);
    return customers.find(c => c.licenseNumber === licenseNumber);
};

export const addCustomer = async (newCustomerData: Omit<Customer, 'serviceHistory'>): Promise<Customer> => {
    await delay(400);
    const existing = customers.find(c => c.licenseNumber.toLowerCase() === newCustomerData.licenseNumber.toLowerCase());
    if (existing) {
        throw new Error(`Customer with license number ${newCustomerData.licenseNumber} already exists.`);
    }
    const newCustomer: Customer = {
        ...newCustomerData,
        serviceHistory: [],
    };
    customers.unshift(newCustomer); // Add to the beginning
    return JSON.parse(JSON.stringify(newCustomer));
};

export const updateCustomer = async (updatedCustomer: Customer): Promise<Customer> => {
    await delay(400);
    const index = customers.findIndex(c => c.licenseNumber === updatedCustomer.licenseNumber);
    if (index !== -1) {
        customers[index] = { ...customers[index], ...updatedCustomer };
        return { ...customers[index] };
    }
    throw new Error("Customer not found");
};

export const addServiceHistory = async (
    licenseNumber: string,
    serviceHistory: Omit<ServiceHistory, 'id' | 'date'>
): Promise<ServiceHistory> => {
    await delay(400);
    const customer = customers.find(c => c.licenseNumber === licenseNumber);
    if (customer) {
        const newHistory: ServiceHistory = {
            ...serviceHistory,
            id: `SH-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
        };
        if (!customer.serviceHistory) {
            customer.serviceHistory = [];
        }
        customer.serviceHistory.push(newHistory);
        return newHistory;
    }
    throw new Error("Customer not found");
};
