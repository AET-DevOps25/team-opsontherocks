import {Navigate, Route, Routes} from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import {useEffect, useState} from 'react';
import Dashboard from "@/pages/Dashboard.tsx";
import Settings from "@/pages/Settings.tsx";
import type {MainCategory} from './types/Categories';

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

    const [mainCategories, setMainCategories] = useState<MainCategory[]>([
        {
            id: "career",
            name: "Career",
            color: "#8B5CF6",
            subcategories: [
                {id: "job-satisfaction", name: "Job Satisfaction", score: 7, mainCategory: "career"},
                {id: "career-growth", name: "Career Growth", score: 6, mainCategory: "career"},
                {id: "work-life-balance", name: "Work-Life Balance", score: 6, mainCategory: "career"},
            ],
        },
        {
            id: "relationships",
            name: "Relationships",
            color: "#06B6D4",
            subcategories: [
                {id: "family", name: "Family", score: 8, mainCategory: "relationships"},
                {id: "friends", name: "Friends", score: 6, mainCategory: "relationships"},
                {id: "romance", name: "Romance", score: 7, mainCategory: "relationships"},
                {id: "social-life", name: "Social Life", score: 7, mainCategory: "relationships"},
            ],
        },
        {
            id: "health",
            name: "Health",
            color: "#10B981",
            subcategories: [
                {id: "mental-health", name: "Mental Health", score: 7, mainCategory: "health"},
                {id: "physical-health", name: "Physical Health", score: 7, mainCategory: "health"},
                {id: "nutrition", name: "Nutrition", score: 6, mainCategory: "health"},
                {id: "sleep", name: "Sleep", score: 6, mainCategory: "health"},
            ],
        },
        {
            id: "other",
            name: "Other",
            color: "#F59E0B",
            subcategories: [
                {id: "finances", name: "Finances", score: 8, mainCategory: "other"},
                {id: "personal-development", name: "Personal Development", score: 7, mainCategory: "other"},
                {id: "spirituality", name: "Spirituality", score: 6, mainCategory: "other"},
                {id: "entertainment", name: "Entertainment", score: 8, mainCategory: "other"},
            ],
        },
    ])

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
                            mainCategories={mainCategories}
                            onUpdateCategories={(updated) => setMainCategories(updated)}
                            onBack={() => {
                                window.location.href = "/";
                            }}
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
