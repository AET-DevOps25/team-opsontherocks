// src/App.tsx
import { Navigate, Route, Routes } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import WheelPage from './pages/WheelPage';
import { useEffect, useState } from 'react';

const serverBase = import.meta.env.VITE_SERVER_URL;

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    const checkAuthStatus = async (): Promise<boolean> => {
        try {
            console.log('[App] Checking /users/me with credentials...');
            const res = await fetch(`${serverBase}/users/me`, {
                method: 'GET',
                mode: 'cors',              // allow CORS
                credentials: 'include',    // send cookies
                headers: { 'Accept': 'application/json' }
            });
            console.log('User authenticated');
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
        return () => { mounted = false; };
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
                path="/wheel"
                element={isAuthenticated ? <WheelPage /> : <Navigate to="/auth" replace />}
            />
            <Route
                path="/*"
                element={<Navigate to={isAuthenticated ? '/wheel' : '/auth'} replace />}
            />
        </Routes>
    );
}
