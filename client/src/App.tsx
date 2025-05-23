import {Navigate, Route, Routes} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import WheelPage from './pages/WheelPage';
import {useEffect, useState} from 'react';

const serverBase = import.meta.env.VITE_SERVER_URL;

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        fetch(`${serverBase}/secured`, {
            credentials: 'include',
        })
            .then(res => {
                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            })
            .catch(() => setIsAuthenticated(false));
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center h-screen">
                Checking authentication…
            </div>
        );
    }

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    return (
        <Routes>
            <Route
                path="/auth"
                element={<AuthPage onLoginSuccess={handleLoginSuccess}/>}
            />
            <Route
                path="/wheel"
                element={
                    isAuthenticated ? <WheelPage/> : <Navigate to="/auth" replace/>
                }
            />
            <Route
                path="/*"
                element={
                    <Navigate to={isAuthenticated ? '/wheel' : '/auth'} replace/>
                }
            />
        </Routes>
    );
}
