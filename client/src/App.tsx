import {useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'
import {Button} from "@/components/ui/button"

function App() {
    const [count, setCount] = useState(0)

    return (
        <div
            className="min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900 flex flex-col items-center justify-center p-6 space-y-8">
            <div
                className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-8">
                    <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
                        <img
                            src={viteLogo}
                            alt="Vite logo"
                            className="h-20 w-20"
                        />
                    </a>
                    <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                        <img
                            src={reactLogo}
                            alt="React logo"
                            className="h-20 w-20 animate-spin-slow"
                        />
                    </a>
                </div>

                <h1 className="text-6xl font-extrabold mt-6">Vite + React</h1>

                <div className="w-full bg-gray-100 rounded-lg shadow p-4 mt-6 text-center">

                    <Button
                        className="mb-4"
                        onClick={() => setCount((c) => c + 1)}
                    >
                        count is {count}
                    </Button>

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

export default App
