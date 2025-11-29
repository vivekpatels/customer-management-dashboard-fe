
export interface ServiceHistory {
    id: string;
    employeeName: string;
    serviceType: 'Installation' | 'Maintenance' | 'Repair' | 'Check-up';
    status: 'Completed' | 'In Progress' | 'Pending';
    collectionAmount: number;
    problemDescription: string;
    solution: string;
    date: string;
}

export interface Customer {
    licenseNumber: string;
    name: string;
    monthYear: string;
    address: string;
    mobile1: string;
    mobile2?: string;
    installedBy: string;
    serviceType: 'New' | 'Renewal';
    installedOn: string;
    serviceHistory?: ServiceHistory[];
}
