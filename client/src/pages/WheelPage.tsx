import {useEffect, useState} from 'react'
import reactLogo from '../assets/react.svg';

import viteLogo from '/vite.svg';
import {Button} from '@/components/ui/button'

export default function WheelPage() {
    const [count, setCount] = useState(0)
    const [serverData, setServerData] = useState<string | null>(null)
    const [publicData, setPublicData] = useState<string | null>(null)
    const [clientData, setClientData] = useState<string | null>(null)

    const serverBase = import.meta.env.VITE_SERVER_URL
    const genAIBase = import.meta.env.VITE_GENAI_URL

    if (!serverBase) {
        console.warn('VITE_SERVER_URL is undefined – check your Docker Compose env settings')
    }
    if (!genAIBase) {
        console.warn('VITE_GENAI_URL is undefined – check your Docker Compose env settings')
    }

    //TODO: Fix 403 error
    useEffect(() => {
        if (!serverBase) return

        fetch(`${serverBase}/secured`)
            .then(res => {
                if (!res.ok) throw new Error(`Server API error ${res.status}`)
                return res.text()
            })
            .then(text => setServerData(text))
            .catch(console.error)
    }, [serverBase])

    // fetch public endpoint
    useEffect(() => {
        if (!serverBase) return

        fetch(`${serverBase}/public`)
            .then(res => {
                if (!res.ok) throw new Error(`Server API error ${res.status}`)
                return res.text()
            })
            .then(text => setPublicData(text))
            .catch(console.error)
    }, [serverBase])

    // fetch from your genai (client) endpoint
    useEffect(() => {
        if (!genAIBase) return

        fetch(`${genAIBase}/hello`)
            .then(res => {
                if (!res.ok) throw new Error(`GenAI API error ${res.status}`)
                return res.text()
            })
            .then(text => setClientData(text))
            .catch(console.error)
    }, [genAIBase])

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 space-y-8">
            <div
                className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-8">
                    <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                        <img src={viteLogo} alt="Vite logo" className="h-20 w-20"/>
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                        <img src={reactLogo} alt="React logo" className="h-20 w-20 animate-spin-slow"/>
                    </a>
                </div>

                <h1 className="text-6xl font-extrabold mt-6">Vite + React</h1>

                <div className="w-full bg-gray-100 rounded-lg shadow p-4 mt-6 text-center">
                    <Button className="mb-4" onClick={() => setCount(c => c + 1)}>
                        count is {count}
                    </Button>

                    <div className="text-left text-sm overflow-auto max-h-40 bg-white p-2 rounded space-y-2">
                        {serverData ? (
                            <pre className="whitespace-pre-wrap"><strong>Secured:</strong> {serverData}</pre>
                        ) : (
                            <p>Loading secured data…</p>
                        )}

                        {publicData ? (
                            <pre className="whitespace-pre-wrap"><strong>Public:</strong> {publicData}</pre>
                        ) : (
                            <p>Loading public data…</p>
                        )}

                        {clientData ? (
                            <pre className="whitespace-pre-wrap"><strong>GenAI:</strong> {clientData}</pre>
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
    )
}
