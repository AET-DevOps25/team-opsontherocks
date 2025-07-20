import React, {useEffect, useState, useCallback} from "react";
import { Calendar, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    loading: boolean;
    error: string | null;
    onViewReport?: (report: import("@/hooks/useReports").Report) => void;
}

const RecentReportsGrid: React.FC<Props> = ({
                                                reports,
                                                loading,
                                                error,
                                                onViewReport,
                                            }) => {
    const [categories, setCategories] = useState<MainCategory[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [categoriesError, setCategoriesError] = useState<string | null>(null);

    // API helper for fetching categories
    const SERVER = import.meta.env.VITE_SERVER_URL as string | undefined;
    const base = SERVER ? `${SERVER}/users/me/categories` : undefined;
    const api = useCallback(<T, >(path: string, opts: RequestInit = {}): Promise<T> => {
        if (!base) return Promise.reject(new Error('VITE_SERVER_URL not set')) as Promise<T>;
        const url = `${base}${path}`;
        console.log('[RecentReports] →', opts.method ?? 'GET', url, opts.body ?? '');
        return fetch(url, {
            credentials: 'include',
            headers: {'Content-Type': 'application/json', ...(opts.headers || {})}, ...opts
        })
            .then(async res => {
                const txt = await res.clone().text();
                console.log('[RecentReports] ←', res.status, url, txt);
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

    // Helper function to get trend indicator
    const getTrendIcon = (score: number) => {
        if (score >= 8) return <TrendingUp className="h-3 w-3 text-green-500" />;
        if (score <= 3) return <TrendingDown className="h-3 w-3 text-red-500" />;
        return <Minus className="h-3 w-3 text-gray-400" />;
    };

    // Helper function to get score color
    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-green-600";
        if (score >= 6) return "text-yellow-600";
        if (score >= 4) return "text-orange-600";
        return "text-red-600";
    };

    // Helper function to get score badge variant
    const getScoreBadgeVariant = (score: number) => {
        if (score >= 8) return "default" as const;
        if (score >= 6) return "secondary" as const;
        if (score >= 4) return "outline" as const;
        return "destructive" as const;
    };

    // Helper function to get category color
    const getCategoryColor = (categoryName: string) => {
        // Find which main category this subcategory belongs to
        for (const category of categories) {
            const subcategory = category.subcategories.find(sub => sub.name === categoryName);
            if (subcategory) {
                return category.color;
            }
        }
        return "#6B7280"; // Default gray
    };

    return (
        <Card className="rounded-3xl bg-white shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl text-gray-900">Recent Reports</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                    Highlights from your reflections
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                {loading || categoriesLoading ? (
                    <p className="text-center py-8 text-gray-500">Loading reports…</p>
                ) : error || categoriesError ? (
                    <p className="text-center py-8 text-red-500">{error || categoriesError}</p>
                ) : reports.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                        No previous reports found.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reports.map((r) => {
                            const highlight =
                                r.notes && r.notes.length > 50
                                    ? `${r.notes.slice(0, 50)}…`
                                    : r.notes || `Week ${r.calendarWeek}, ${r.year}`;

                            // Calculate average score
                            const scores = Object.values(r.scores);
                            const averageScore = scores.length > 0 
                                ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
                                : 0;

                            // Get top 3 categories by score
                            const topCategories = Object.entries(r.scores)
                                .sort(([,a], [,b]) => b - a)
                                .slice(0, 3);

                            return (
                                <Card
                                    key={`${r.year}-${r.calendarWeek}`}
                                    className="rounded-2xl border border-gray-200 hover:shadow-md hover:scale-[1.03] transition-all duration-200 bg-white cursor-pointer group"
                                    onClick={() => onViewReport?.(r)}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg text-gray-800 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                                {highlight}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onViewReport?.(r);
                                                }}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardDescription className="text-sm text-gray-500 flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Week {r.calendarWeek}, {r.year}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        {/* Average Score */}
                                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-700">Average Score</span>
                                                <Badge 
                                                    variant={getScoreBadgeVariant(averageScore)}
                                                    className="text-sm font-semibold"
                                                >
                                                    {averageScore}/10
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Top Categories */}
                                        <div className="space-y-2">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                                                Top Categories
                                            </h4>
                                            {topCategories.map(([cat, score]) => (
                                                <div
                                                    key={cat}
                                                    className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        {getTrendIcon(score)}
                                                        <span className="text-sm text-gray-700 truncate">
                                                            {cat}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div 
                                                            className="w-2 h-2 rounded-full" 
                                                            style={{ backgroundColor: getCategoryColor(cat) }}
                                                        />
                                                        <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                                                            {score}/10
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                            
                                            {Object.keys(r.scores).length > 3 && (
                                                <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-100">
                                                    +{Object.keys(r.scores).length - 3} more categories
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default RecentReportsGrid;
