import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import { useEffect, useState } from 'react';
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import ReportPage from "@/pages/ReportPage";
import { Report } from "@/hooks/useReports";
import { CategoryValue } from "@/types/categories";

const serverBase = import.meta.env.VITE_SERVER_URL;

// Helper function to convert report scores to CategoryValue format
const convertReportToCategoryValues = (report: Report): CategoryValue[] => {
    const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
    return Object.entries(report.scores).map(([name, value], index) => ({
        name,
        value: value as number,
        color: colors[index % colors.length]
    }));
};

function AppRoutes() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const navigate = useNavigate();

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            console.log('[App] Checking /users/me with credentials...');
            const res = await fetch(`${serverBase}/users/me`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: { 'Accept': 'application/json' }
            });
            return res.ok;
        } catch (err) {
            console.log('User not authenticated');
            return false;
        }
    };

    useEffect(() => {
        let mounted = true;
        (async () => {
            console.log('[App] Running initial auth check');
            const ok = await checkAuthStatus();
            if (mounted) setIsAuthenticated(ok);
        })();
        return () => {
            mounted = false;
        };
    }, []);

    if (isAuthenticated === null) {
        return <div className="flex items-center justify-center h-screen">Checking authentication…</div>;
    }

    const handleLoginSuccess = async (): Promise<boolean> => {
        console.log('[App] Login succeeded, re-checking session');
        const ok = await checkAuthStatus();
        setIsAuthenticated(ok);
        return ok;
    };

    const handleViewReport = (report: Report) => {
        setSelectedReport(report);
        navigate("/report");
    };

    const handleBackToDashboard = () => {
        setSelectedReport(null);
        navigate("/");
    };

    return (
        <Routes>
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess} />} />

            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Dashboard
                            onCreateReport={() => navigate("/report")}
                            onOpenSettings={() => navigate("/settings")}
                            onViewReport={handleViewReport}
                        />
                    ) : (
                        <Navigate to="/auth" replace />
                    )
                }
            />

            <Route
                path="/settings"
                element={
                    isAuthenticated ? (
                        <Settings
                            onBack={() => navigate("/")}
                        />
                    ) : (
                        <Navigate to="/auth" replace />
                    )
                }
            />

            <Route
                path="/results"
                element={
                    isAuthenticated ? (
                        <ResultsPage />
                    ) : (
                        <Navigate to="/auth" replace />
                    )
                }
            />

            <Route
                path="/report"
                element={
                    isAuthenticated ? (
                        <ReportPage 
                            onBack={handleBackToDashboard} 
                            initialData={selectedReport ? convertReportToCategoryValues(selectedReport) : undefined}
                            initialNotes={selectedReport?.notes || ""}
                        />
                    ) : (
                        <Navigate to="/auth" replace />
                    )
                }
            />

            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace />}
            />
        </Routes>
    );
}

export default function App() {
    return <AppRoutes />;
}
