import {Navigate, Route, Routes} from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import WheelPage from './pages/WheelPage'
import {useEffect, useState} from "react";


export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => !!localStorage.getItem('authToken')
    );

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
    };

    useEffect(() => {
        console.log('App - isAuthenticated:', isAuthenticated);
    }, [isAuthenticated]);

    return (
        <Routes>
            <Route path="/auth" element={<AuthPage onLoginSuccess={handleLoginSuccess}/>}/>
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