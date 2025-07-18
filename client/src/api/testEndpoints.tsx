// src/utils/testEndpoints.tsx
'use client';

import {useEffect, useState} from 'react';
import {WHEEL_URL} from "@/config/api";
import {GENAI_URL} from "@/config/api";


export function useTestEndpoints() {
    const [userData, setUserData] = useState<string | null>(null);
    const [healthCheckData, setHealthCheckData] = useState<string | null>(null);
    const [genAiHelloData, setGenAiHelloData] = useState<string | null>(null);

    const serverBase = WHEEL_URL;
    const genAIBase = GENAI_URL;

    useEffect(() => {
        if (!serverBase) {
            setUserData('Error: VITE_SERVER_URL not configured');
            return;
        }
        fetch(`${serverBase}/users/me`, {credentials: 'include'})
            .then(res => res.ok ? res.text() : Promise.reject(new Error(`Status ${res.status}`)))
            .then(setUserData)
            .catch(err => setUserData(`Error: ${err.message}`));
    }, [serverBase]);

    useEffect(() => {
        if (!serverBase) {
            setHealthCheckData('Error: VITE_SERVER_URL not configured');
            return;
        }
        fetch(`${serverBase}/healthCheck`)
            .then(res => res.ok ? res.text() : Promise.reject(new Error(`Status ${res.status}`)))
            .then(setHealthCheckData)
            .catch(err => setHealthCheckData(`Error: ${err.message}`));
    }, [serverBase]);

    useEffect(() => {
        if (!genAIBase) {
            setGenAiHelloData('Error: VITE_GENAI_URL not configured');
            return;
        }
        fetch(`${genAIBase}/hello`, {credentials: 'include'})
            .then(res => res.ok ? res.text() : Promise.reject(new Error(`Status ${res.status}`)))
            .then(setGenAiHelloData)
            .catch(err => setGenAiHelloData(`Error: ${err.message}`));
    }, [genAIBase]);

    return {userData, healthCheckData, genAiHelloData};
}
