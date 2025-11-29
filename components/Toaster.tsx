
import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

let toastCount = 0;
const toastListeners = new Set<(toast: Omit<ToastMessage, 'id'>) => void>();

const addToast = (message: string, type: ToastType) => {
  const newToast = { message, type };
  toastListeners.forEach(listener => listener(newToast));
};

export const toast = {
  success: (message: string) => addToast(message, 'success'),
  error: (message: string) => addToast(message, 'error'),
  info: (message: string) => addToast(message, 'info'),
};

const Toast: React.FC<ToastMessage & { onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const baseClasses = 'flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow-lg';
  const typeClasses = {
    success: 'text-green-500 bg-green-100',
    error: 'text-red-500 bg-red-100',
    info: 'text-blue-500 bg-blue-100',
  };
  const Icon = {
    success: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
    ),
    error: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"></path></svg>
    ),
    info: () => (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
    ),
  };
  
  return (
    <div className={`${baseClasses}`} role="alert">
      <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${typeClasses[type]} rounded-lg`}>
        {Icon[type]()}
      </div>
      <div className="ml-3 text-sm font-normal">{message}</div>
      <button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" onClick={onDismiss}>
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const portalRoot = document.body;

  useEffect(() => {
    const listener = (toast: Omit<ToastMessage, 'id'>) => {
      setToasts(currentToasts => [...currentToasts, { ...toast, id: toastCount++ }]);
    };

    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
  }, []);
  
  if (!portalRoot) return null;

  return ReactDOM.createPortal(
    <div className="fixed top-5 right-5 z-[100]">
      {toasts.map(toast => (
        <Toast key={toast.id} {...toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>,
    portalRoot
  );
};
