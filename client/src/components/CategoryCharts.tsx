import React, {useMemo, useEffect, useState, useCallback} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import ChartCard from "./ChartCard";
import { MainCategory } from "@/types/categories";

// Define the 4 main categories with their colors
const PRESET_GROUPS = [
    {id: 'Career', label: 'Career', color: '#8B5CF6'},
    {id: 'Relationships', label: 'Relationships', color: '#06B6D4'},
    {id: 'Health', label: 'Health', color: '#10B981'},
    {id: 'Other', label: 'Other', color: '#F59E0B'},
] as const;

type GroupId = (typeof PRESET_GROUPS)[number]['id'];

interface CategoryFromApi {
    id: number;
    name: string;
    categoryGroup: 'Career' | 'Relationships' | 'Health' | 'Other';
}

interface Props {
    reports: import("@/hooks/useReports").Report[];
}

const CategoryCharts: React.FC<Props> = ({reports}) => {
    const [categories, setCategories] = useState<MainCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    // API helper for fetching categories
    const SERVER = import.meta.env.VITE_SERVER_URL as string | undefined;
    const base = SERVER ? `${SERVER}/users/me/categories` : undefined;
    const api = useCallback(<T, >(path: string, opts: RequestInit = {}): Promise<T> => {
        if (!base) return Promise.reject(new Error('VITE_SERVER_URL not set')) as Promise<T>;
        const url = `${base}${path}`;
        console.log('[CategoryCharts] →', opts.method ?? 'GET', url, opts.body ?? '');
        return fetch(url, {
            credentials: 'include',
            headers: {'Content-Type': 'application/json', ...(opts.headers || {})}, ...opts
        })
            .then(async res => {
                const txt = await res.clone().text();
                console.log('[CategoryCharts] ←', res.status, url, txt);
                if (!res.ok) throw new Error(txt || res.statusText);
                return (res.status === 204 ? (undefined as unknown as T) : JSON.parse(txt)) as T;
            });
    }, [base]);

    // Fetch categories from backend
    const refreshCategories = useCallback(async () => {
        try {
            setCategoriesLoading(true);
            const raw = await api<CategoryFromApi[]>('', {method: 'GET'});
            const grouped: Record<GroupId, CategoryFromApi[]> = {Career: [], Relationships: [], Health: [], Other: []};
            raw.forEach(c => {
                const key = (c.categoryGroup || '') as GroupId;
                if (key in grouped) grouped[key].push(c);
                else console.warn('Unknown group', c);
            });
            const ui: MainCategory[] = PRESET_GROUPS.map(g => ({
                id: g.id, name: g.label, color: g.color,
                subcategories: grouped[g.id].map(c => ({id: String(c.id), name: c.name, score: 5, mainCategory: g.id}))
            }));
            setCategories(ui);
            setCategoriesError(null);
        } catch (e: any) {
            setCategoriesError(e.message)
        } finally {
            setCategoriesLoading(false)
        }
    }, [api]);

    useEffect(() => {
        refreshCategories();
    }, [refreshCategories]);

    const {groupSeries, groupSubcats} = useMemo(() => {
        // Create subcategory sets for each main category
        const subcatSets: Record<GroupId, Set<string>> = {
            Career: new Set(),
            Health: new Set(),
            Relationships: new Set(),
            Other: new Set(),
        };

        if (categoriesLoading || categoriesError || categories.length === 0) {
            return { 
                groupSeries: { Career: [], Health: [], Relationships: [], Other: [] }, 
                groupSubcats: subcatSets 
            };
        }

        // Initialize with categories from backend
        categories.forEach((category) => {
            const groupId = category.id as GroupId;
            if (groupId in subcatSets) {
                category.subcategories.forEach((subcat) => {
                    subcatSets[groupId].add(subcat.name);
                });
            }
        });

        // Add any additional subcategories from reports
        reports.forEach((r) => {
            Object.keys(r.scores).forEach((cat) => {
                // Find which main category this subcategory belongs to
                for (const category of categories) {
                    const subcategory = category.subcategories.find(sub => sub.name === cat);
                    if (subcategory) {
                        const groupId = category.id as GroupId;
                        if (groupId in subcatSets) {
                            subcatSets[groupId].add(cat);
                        }
                        break;
                    }
                }
            });
        });

        const labelFor = (y: number, w: number) => `W${w}-${String(y).slice(-2)}`;
        const baseMaps: Record<GroupId, Map<string, any>> = {
            Career: new Map(),
            Health: new Map(),
            Relationships: new Map(),
            Other: new Map(),
        };

        reports.forEach((r) => {
            const label = labelFor(r.year, r.calendarWeek);
            PRESET_GROUPS.forEach((g) => {
                if (!baseMaps[g.id].has(label)) {
                    const obj: Record<string, number | null | string> = {label};
                    subcatSets[g.id].forEach((sc) => (obj[sc] = null));
                    obj["Average"] = null;
                    baseMaps[g.id].set(label, obj);
                }
            });
        });

        reports.forEach((r) => {
            const label = labelFor(r.year, r.calendarWeek);
            Object.entries(r.scores).forEach(([cat, val]) => {
                // Find which main group this subcategory belongs to
                for (const category of categories) {
                    const subcategory = category.subcategories.find(sub => sub.name === cat);
                    if (subcategory) {
                        const groupId = category.id as GroupId;
                        if (baseMaps[groupId] && baseMaps[groupId].has(label)) {
                            baseMaps[groupId].get(label)[cat] = val;
                        }
                        break;
                    }
                }
            });
        });

        const result: Record<GroupId, any[]> = {
            Career: [],
            Health: [],
            Relationships: [],
            Other: [],
        };

        PRESET_GROUPS.forEach((g) => {
            const arr = [...baseMaps[g.id].values()].sort(
                (a, b) =>
                    parseInt(a.label.slice(1)) - parseInt(b.label.slice(1)) // simple sort
            );
            arr.forEach((o) => {
                const vals = [...subcatSets[g.id]]
                    .map((sc) => o[sc])
                    .filter((n) => typeof n === "number") as number[];
                o["Average"] =
                    vals.length === 0
                        ? null
                        : parseFloat(
                            (vals.reduce((s, n) => s + n, 0) / vals.length).toFixed(2)
                        );
            });
            result[g.id] = arr;
        });

        return {
            groupSeries: result, 
            groupSubcats: subcatSets
        };
    }, [reports, categories, categoriesLoading, categoriesError]);

    if (categoriesLoading) {
        return (
            <Card className="rounded-3xl bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl text-gray-900">
                        Weekly Progress – Detailed
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-center py-8 text-gray-500">Loading categories…</p>
                </CardContent>
            </Card>
        );
    }

    if (categoriesError) {
        return (
            <Card className="rounded-3xl bg-white shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl text-gray-900">
                        Weekly Progress – Detailed
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-center py-8 text-red-500">{categoriesError}</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="relative group">
            <div
                aria-hidden="true"
                className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-[calc(1.5rem+1px)] opacity-50 group-hover:opacity-75 transition-opacity duration-500 blur-xl animate-aurora-border"
            />
            <Card className="relative rounded-3xl bg-white shadow-lg border-none">
                <CardHeader>
                    <CardTitle className="text-3xl text-gray-900">
                        Weekly Progress – Detailed
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {PRESET_GROUPS.map((g) => (
                            <ChartCard
                                key={g.id}
                                title={g.label}
                                data={groupSeries[g.id] || []}
                                subCategories={[...(groupSubcats[g.id] || [])]}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CategoryCharts;
