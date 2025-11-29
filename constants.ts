
import { Customer } from './types';

export const DASHBOARD_COLUMNS: { key: keyof Customer; label: string }[] = [
    { key: 'licenseNumber', label: 'License No.' },
    { key: 'name', label: 'Customer Name' },
    { key: 'monthYear', label: 'Month-Year' },
    { key: 'address', label: 'Address' },
    { key: 'mobile1', label: 'Mobile 1' },
    { key: 'mobile2', label: 'Mobile 2' },
    { key: 'installedBy', label: 'Installed By' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'installedOn', label: 'Installed On' },
];
