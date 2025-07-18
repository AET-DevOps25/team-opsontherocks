import { useCallback, useEffect, useState } from "react";
import {WHEEL_URL} from "@/config/api";

const SERVER = WHEEL_URL;

export interface Report {
    id: number;
    calendarWeek: number;
    year: number;
    userEmail: string;
    notes: string;
    scores: Record<string, number>;
    chat: ChatMessage[];
}

export interface ChatMessage {
    id: number;
    message: string;
    sender: 'USER' | 'AI';
}

async function api<T>(endpoint: string, opts: RequestInit = {}): Promise<T> {
    if (!SERVER) {
        throw new Error("VITE_SERVER_URL not set");
    }
    
    const res = await fetch(`${SERVER}${endpoint}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
        ...opts,
    });
    
    const txt = await res.clone().text();
    console.log("[useReports] ←", res.status, endpoint, txt);
    
    if (!res.ok) throw new Error(txt || res.statusText);
    return txt ? (JSON.parse(txt) as T) : (undefined as unknown as T);
}

export function useReports() {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            const data = await api<Report[]>("/users/me/reports", { method: "GET" });
            console.log("[useReports] fetched", data);
            
            // Sort reports by year and week (newest first)
            const sortedReports = data.sort((a, b) => {
                if (a.year !== b.year) return b.year - a.year;
                return b.calendarWeek - a.calendarWeek;
            });
            
            setReports(sortedReports);
            setError(null);
        } catch (err: any) {
            console.error("[useReports] error", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const getCurrentWeekReport = useCallback(async () => {
        try {
            const now = new Date();
            const week = getISOWeek(now);
            const year = now.getFullYear();
            
            const data = await api<Report>(`/users/me/reports/${year}/${week}`, { method: "GET" });
            return data;
        } catch (err: any) {
            if (err.message.includes("404")) {
                return null; // No report for current week
            }
            throw err;
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return { reports, loading, error, refresh, getCurrentWeekReport };
}

// Helper function to get ISO week number
function getISOWeek(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
} 