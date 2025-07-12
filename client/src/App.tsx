import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import React, { useEffect, useState } from 'react';
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";
import ReportPage from "@/pages/ReportPage";
import ResultsPage from "@/pages/ResultsPage";

const serverBase = import.meta.env.VITE_SERVER_URL;

function AppRoutes() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
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
                path="/report"
                element={
                    isAuthenticated ? (
                        <ReportPage />
                    ) : (
                        <Navigate to="/auth" replace />
                    )
                }
            />

            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace />}
            />
            <Route path="/results"
                   element={isAuthenticated ? (
                <ResultsPage />
                   ) : (
                       <Navigate to="/auth" replace />
                   )
            }
            />
        </Routes>
    );
}

export default function App() {
    return <AppRoutes />;
}
