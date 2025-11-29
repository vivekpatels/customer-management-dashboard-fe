import React from 'react';
import { ServiceHistory } from '../types';
import Modal from './ui/Modal';
import Button from './ui/Button';
import EmptyState from './ui/EmptyState';
import { NoDataIcon } from './icons/Icons';

interface ViewServiceHistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ServiceHistory[];
}

const ViewServiceHistoryModal: React.FC<ViewServiceHistoryModalProps> = ({ isOpen, onClose, history }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Service History">
            <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                {history.length > 0 ? (
                    <div className="space-y-4">
                        {[...history].reverse().map(record => (
                            <div key={record.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-primary">{new Date(record.date).toLocaleDateString()}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        record.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        record.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    <p><span className="font-semibold">Employee:</span> {record.employeeName}</p>
                                    <p><span className="font-semibold">Service:</span> {record.serviceType}</p>
                                    <p><span className="font-semibold">Amount:</span> ₹{record.collectionAmount}</p>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p className="font-semibold">Problem:</p>
                                    <p className="text-slate-600 pl-2">{record.problemDescription}</p>
                                </div>
                                <div className="mt-2 text-sm">
                                    <p className="font-semibold">Solution:</p>
                                    <p className="text-slate-600 pl-2">{record.solution}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        Icon={NoDataIcon}
                        title="No service history found"
                        description="This customer does not have any service records yet."
                    />
                )}
            </div>
             <div className="mt-6 flex justify-end">
                <Button onClick={onClose} variant="neutral">Close</Button>
            </div>
        </Modal>
    );
};

export default ViewServiceHistoryModal;