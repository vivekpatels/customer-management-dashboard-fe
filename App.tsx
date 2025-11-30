import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';

type Page = 'dashboard' | 'reports';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('dashboard');

    return (
        <>
            {currentPage === 'dashboard' && (
                <Dashboard onNavigateToReports={() => setCurrentPage('reports')} />
            )}
            {currentPage === 'reports' && (
                <Reports onNavigateToDashboard={() => setCurrentPage('dashboard')} />
            )}
        </>
    );
};

export default App;
