import axios from "axios";
import { Customer, ServiceHistory } from "../types";

const API = axios.create({
    baseURL: "https://customer-management-dashboard.onrender.com/api",   // your backend URL
});

// Attach token automatically if logged in
// API.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// =========================
// CUSTOMERS
// =========================

export const getCustomers = async (): Promise<Customer[]> => {
    const res = await API.get("/customers");
    return res.data.data;
};

export const getCustomerById = async (id: string): Promise<Customer> => {
    const res = await API.get(`/customers/${id}`);
    return res.data.data;
};

export const addCustomer = async (newCustomer: any): Promise<Customer> => {
    const res = await API.post("/customers", newCustomer);
    return res.data.data;
};

export const updateCustomer = async (licenseNumber: string, updatedData: any): Promise<Customer> => {
    const res = await API.put(`/customers/${licenseNumber}`, updatedData);
    return res.data.data;
};

export const deleteCustomer = async (licenseNumber: string): Promise<void> => {
    await API.delete(`/customers/${licenseNumber}`);
};

// =========================
// SERVICE HISTORY
// =========================

export const addServiceHistory = async (
    licenseNumber: string,
    historyData: any
): Promise<ServiceHistory> => {
    const res = await API.post("/service-history", { ...historyData, licenseNumber });
    return res.data.data;
};

export const getServiceHistoryByCustomer = async (licenseNumber: string): Promise<ServiceHistory[]> => {
    const res = await API.get(`/service-history?licenseNumber=${licenseNumber}`);
    return res.data.data;
};

export const updateServiceHistory = async (licenseNumber: string, updatedData: any): Promise<ServiceHistory> => {
    const res = await API.put(`/service-history/${licenseNumber}`, updatedData);
    return res.data.data;
};

export const deleteServiceHistory = async (licenseNumber: string): Promise<void> => {
    await API.delete(`/service-history/${licenseNumber}`);
};
