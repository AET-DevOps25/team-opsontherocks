import {useCallback, useEffect, useState} from "react";
import {CategoryValue, MainCategory} from "@/types/categories";

const SERVER = import.meta.env.VITE_SERVER_URL as string | undefined;
const base = SERVER
    ? `${SERVER}/users/me/categories`
    : (() => {
        throw new Error("VITE_SERVER_URL not set");
    })();

async function api<T>(opts: RequestInit = {}): Promise<T> {
    const res = await fetch(base, {
        credentials: "include",
        headers: {"Content-Type": "application/json", ...(opts.headers || {})},
        ...opts,
    });
    const txt = await res.clone().text();
    console.log("[useCategories] ←", res.status, txt);
    if (!res.ok) throw new Error(txt || res.statusText);
    return txt ? (JSON.parse(txt) as T) : (undefined as unknown as T);
}

export function useCategories() {
    const [values, setValues] = useState<CategoryValue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);

            const data = await api<MainCategory[]>({method: "GET"});
            console.log("[useCategories] fetched", data);

            const mapped: CategoryValue[] = data.map((mainCategory) => {
                /* Ensure we always have an array to iterate */
                const subs = Array.isArray(mainCategory.subcategories) ? mainCategory.subcategories : [];

                const rawAvg =
                    subs.length === 0
                        ? 5
                        : subs.reduce((sum, c) => sum + (c.score ?? 5), 0) / subs.length;

                const value = Math.max(1, Math.round(rawAvg * 10) / 10);

                return {name: mainCategory.name, value, color: mainCategory.color};
            });

            console.log("[useCategories] mapped →", mapped);
            setValues(mapped);
            setError(null);
        } catch (err: any) {
            console.error("[useCategories] error", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
    }, [refresh]);

    return {values, setValues, loading, error, refresh};
}
