import { useEffect, useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from '@/components/ui/button'

export default function WheelPage() {
    const [count, setCount] = useState(0)
    const [serverData, setServerData] = useState<string | null>(null)
    const [publicData, setPublicData] = useState<string | null>(null)
    const [genAIData, setGenAIData] = useState<string | null>(null)

    const serverBase = import.meta.env.VITE_SERVER_URL
    const genAIBase = import.meta.env.VITE_GENAI_URL

    useEffect(() => {
        if (!serverBase) {
            console.warn('[WheelPage] VITE_SERVER_URL is not defined.');
            return;
        }
        console.log('[WheelPage] Fetching /users/me data...');
        fetch(`${serverBase}/users/me`, {
            credentials: 'include',
        })
            .then(res => {
                if (!res.ok) {
                    console.error(`[WheelPage] Server API error for /users/me. Status: ${res.status}`);
                    throw new Error(`Server API error ${res.status}`);
                }
                return res.text();
            })
            .then(text => {
                console.log('[WheelPage] Successfully fetched /users/me data.');
                setServerData(text);
            })
            .catch(err => {
                console.error('[WheelPage] Error fetching /users/me:', err.message);
                setServerData(`Error: ${err.message}`);
            });
    }, [serverBase]);

    useEffect(() => {
        if (!serverBase) {
            console.warn('[WheelPage] VITE_SERVER_URL is not defined.');
            return;
        }
        console.log('[WheelPage] Fetching /healthCheck data...');
        fetch(`${serverBase}/healthCheck`)
            .then(res => {
                if (!res.ok) {
                    console.error(`[WheelPage] Server API error for /healthCheck. Status: ${res.status}`);
                    throw new Error(`Server API error ${res.status}`);
                }
                return res.text();
            })
            .then(text => {
                console.log('[WheelPage] Successfully fetched /healthCheck data.');
                setPublicData(text);
            })
            .catch(err => {
                console.error('[WheelPage] Error fetching /healthCheck:', err.message);
                setPublicData(`Error: ${err.message}`);
            });
    }, [serverBase]);

    useEffect(() => {
        if (!genAIBase) {
            console.warn('[WheelPage] VITE_GENAI_URL is not defined.');
            return;
        }
        console.log('[WheelPage] Fetching GenAI /hello data...');
        fetch(`${genAIBase}/hello`, {
            credentials: 'include', // ✅ Ensures cookies/JWTs are sent
        })
            .then(res => {
                if (!res.ok) {
                    console.error(`[WheelPage] GenAI API error for /hello. Status: ${res.status}`);
                    throw new Error(`GenAI API error ${res.status}`);
                }
                return res.text();
            })
            .then(text => {
                console.log('[WheelPage] Successfully fetched GenAI /hello data.');
                setGenAIData(text);
            })
            .catch(err => {
                console.error('[WheelPage] Error fetching GenAI /hello:', err.message);
                setGenAIData(`Error: ${err.message}`);
            });
    }, [genAIBase]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 space-y-8">
            <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-8">
                    <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                        <img src={viteLogo} alt="Vite logo" className="h-20 w-20" />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                        <img src={reactLogo} alt="React logo" className="h-20 w-20 animate-spin-slow" />
                    </a>
                </div>

                <h1 className="text-6xl font-extrabold mt-6">Vite + React</h1>

                <div className="w-full bg-gray-100 rounded-lg shadow p-4 mt-6 text-center">
                    <Button className="mb-4" onClick={() => setCount(c => c + 1)}>
                        count is {count}
                    </Button>

                    <div className="text-left text-sm overflow-auto max-h-40 bg-white p-2 rounded space-y-2">
                        {serverData !== null ? (
                            <pre className="whitespace-pre-wrap"><strong>Hello,</strong> {serverData}</pre>
                        ) : (
                            <p>Loading secured data…</p>
                        )}

                        {publicData !== null ? (
                            <pre className="whitespace-pre-wrap"><strong>Public:</strong> {publicData}</pre>
                        ) : (
                            <p>Loading public data…</p>
                        )}

                        {genAIData !== null ? (
                            <pre className="whitespace-pre-wrap"><strong>GenAI:</strong> {genAIData}</pre>
                        ) : (
                            <p>Loading GenAI data…</p>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 mt-2">
                        Edit <code className="bg-gray-200 px-1 rounded">src/App.tsx</code> and save to test HMR
                    </p>
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    Click on the Vite and React logos to learn more
                </p>
            </div>
        </div>
    );
}
