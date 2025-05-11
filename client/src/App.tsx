import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'  // contains only Tailwind layers

function App() {
    const [count, setCount] = useState(0)

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-6 space-y-8">

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

            <h1 className="text-6xl font-extrabold">Vite + React</h1>

            <div className="w-full max-w-sm bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center space-y-4">
                <button
                    onClick={() => setCount((c) => c + 1)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white font-medium rounded-lg transition"
                >
                    count is {count}
                </button>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Edit <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">src/App.tsx</code> and save to test HMR
                </p>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
                Click on the Vite and React logos to learn more
            </p>
        </div>
    )
}

export default App
