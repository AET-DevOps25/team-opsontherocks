import {Navigate, Route, Routes} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import {useEffect, useState} from 'react';
import Dashboard from "@/pages/Dashboard";
import Settings from "@/pages/Settings";

const serverBase = import.meta.env.VITE_SERVER_URL;

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            console.log('[App] Checking /users/me with credentials...');
            const res = await fetch(`${serverBase}/users/me`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {'Accept': 'application/json'}
            });
            return res.ok;
        } catch (err) {
            console.log('User not authenticated');
            return false;
        }
    };

    useEffect(() => {
        console.log('hi')
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
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess}/>}/>

            <Route
                path="/"
                element={
                    isAuthenticated ? (
                        <Dashboard
                            onCreateReport={() => {
                                throw new Error('Function not implemented.');
                            }}
                            onOpenSettings={() => {
                                window.location.href = "/settings";
                            }}
                        />
                    ) : (
                        <Navigate to="/auth" replace/>
                    )
                }
            />

            <Route
                path="/settings"
                element={
                    isAuthenticated ? (
                        <Settings
                            onBack={() => window.location.href = '/'}
                        />

                    ) : (
                        <Navigate to="/auth" replace/>
                    )
                }
            />

            <Route
                path="*"
                element={<Navigate to={isAuthenticated ? '/' : '/auth'} replace/>}
            />
        </Routes>
    );
}
