import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const serverBase = import.meta.env.VITE_SERVER_URL;

interface AuthPageProps {
    onLoginSuccess: () => void;
}

export default function AuthPage({ onLoginSuccess }: AuthPageProps) {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPass] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const endpoint = tab === 'login' ? '/login' : '/register';
        const payload: any = { email, password };
        if (tab === 'register') payload.name = name;

        try {
            const res = await fetch(`${serverBase}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || `HTTP ${res.status}`);
            }

            // On success, server sets HttpOnly cookie. No client-side storage needed.
            onLoginSuccess();
            navigate('/wheel');
        } catch (err: any) {
            console.error(`${tab.toUpperCase()} error:`, err);
            setError(err.message || 'Something went wrong');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-inter">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex mb-6 rounded-md overflow-hidden">
                    <button
                        onClick={() => setTab('login')}
                        className={`flex-1 py-3 text-lg font-medium transition-all duration-300 ease-in-out
              ${tab === 'login' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setTab('register')}
                        className={`flex-1 py-3 text-lg font-medium transition-all duration-300 ease-in-out
              ${tab === 'register' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                    >
                        Register
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {tab === 'register' && (
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPass(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    />
                    {error && <div className="text-red-600 text-sm mt-2 font-medium">{error}</div>}
                    <Button type="submit" className="w-full py-3 text-lg font-semibold">
                        {tab === 'login' ? 'Login' : 'Register'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
