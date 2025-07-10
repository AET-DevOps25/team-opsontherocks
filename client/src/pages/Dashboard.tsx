import React, { useEffect, useState } from "react";
import { Plus, Settings, Eye, Calendar } from "lucide-react";
import { format, isAfter, startOfWeek, subWeeks, getISOWeek } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTestEndpoints } from "@/api/testEndpoints";
import { useReports, Report } from "@/hooks/useReports";
import { CategoryValue } from "@/types/categories";

interface DashboardProps {
    onCreateReport: () => void;
    onOpenSettings: () => void;
    onViewReport?: (report: Report) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateReport, onOpenSettings, onViewReport }) => {
    const { reports, loading: reportsLoading, error: reportsError, getCurrentWeekReport } = useReports();
    const [currentWeekReport, setCurrentWeekReport] = useState<Report | null>(null);
    const [loadingCurrentWeek, setLoadingCurrentWeek] = useState(true);

    // Check if user can create a new report for this week
    const currentWeek = getISOWeek(new Date());
    const currentYear = new Date().getFullYear();
    const hasCurrentWeekReport = currentWeekReport !== null;
    
    const canCreateNewReport = !hasCurrentWeekReport;

    // Fetch current week report
    useEffect(() => {
        const fetchCurrentWeekReport = async () => {
            try {
                setLoadingCurrentWeek(true);
                const report = await getCurrentWeekReport();
                setCurrentWeekReport(report);
            } catch (err) {
                console.error("Error fetching current week report:", err);
            } finally {
                setLoadingCurrentWeek(false);
            }
        };

        fetchCurrentWeekReport();
    }, [getCurrentWeekReport]);

    // Convert report scores to CategoryValue format for the radar chart
    const convertReportToCategoryValues = (report: Report): CategoryValue[] => {
        return Object.entries(report.scores).map(([name, value]) => ({
            name,
            value: value as number,
            color: getCategoryColor(name)
        }));
    };

    // Helper function to get color for categories
    const getCategoryColor = (categoryName: string): string => {
        const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];
        const index = categoryName.length % colors.length;
        return colors[index];
    };

    // Get recent reports (excluding current week)
    const recentReports = reports.filter(report => 
        !(report.calendarWeek === currentWeek && report.year === currentYear)
    ).slice(0, 6);

    const { userData, healthCheckData, genAiHelloData } = useTestEndpoints();

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900">
                            Welcome back! ✨
                        </h1>
                        <p className="mt-2 text-gray-600 text-base sm:text-lg">
                            Track your life balance and get AI-powered insights for growth
                        </p>
                    </div>
                    <Button
                        onClick={onOpenSettings}
                        variant="outline"
                        className="flex items-center gap-2 transition-transform duration-200 hover:scale-110 border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                        <Settings className="w-4 h-4" />
                        Settings
                    </Button>
                </div>

                <Card className="rounded-3xl bg-white shadow-lg border-none">
                    <CardHeader>
                        <CardTitle className="text-3xl text-gray-900">✨ Weekly Check-in</CardTitle>
                        <CardDescription className="text-base text-gray-600">
                            {loadingCurrentWeek 
                                ? "Checking current week status..."
                                : canCreateNewReport
                                ? "It's time for your weekly reflection! Share how your week went."
                                : "You've already submitted a report for this week."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        {loadingCurrentWeek ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading...</p>
                            </div>
                        ) : hasCurrentWeekReport ? (
                            <div className="space-y-4">
                                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-green-800">
                                                ✅ Report Submitted
                                            </h3>
                                            <p className="text-green-600">
                                                Week {currentWeekReport.calendarWeek}, {currentWeekReport.year}
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => onViewReport?.(currentWeekReport)}
                                            variant="outline"
                                            className="border-green-300 text-green-700 hover:bg-green-100"
                                        >
                                            <Eye className="w-4 h-4 mr-2" />
                                            View Report
                                        </Button>
                                    </div>
                                </div>
                                <Button
                                    onClick={onCreateReport}
                                    size="lg"
                                    className="text-base sm:text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 ease-out bg-purple-600 hover:bg-purple-500 hover:scale-105 text-white shadow-md hover:shadow-lg"
                                >
                                    <Plus className="w-5 h-5 mr-2" />
                                    Update Report
                                </Button>
                            </div>
                        ) : (
                            <Button
                                onClick={onCreateReport}
                                size="lg"
                                className="text-base sm:text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 ease-out bg-purple-600 hover:bg-purple-500 hover:scale-105 text-white shadow-md hover:shadow-lg"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Create Weekly Report
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <div className="relative group">
                    <div
                        aria-hidden="true"
                        className="absolute -inset-0.5 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400
                                   rounded-[calc(1.5rem+1px)] opacity-50 group-hover:opacity-75
                                   transition-opacity duration-500 blur-xl animate-aurora-border"
                    ></div>
                    <Card className="relative rounded-3xl bg-white shadow-lg border-none">
                        <CardHeader>
                            <CardTitle className="text-3xl text-gray-900">Weekly Progress</CardTitle>
                            <CardDescription className="text-sm text-gray-600">
                                Your progress over the past 8 weeks
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="h-56 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 bg-gray-50/50">
                                📈 Chart goes here
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="rounded-3xl bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-3xl text-gray-900">Recent Weekly Reports</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                            Highlights from your recent reflections
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {reportsLoading ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">Loading reports...</p>
                            </div>
                        ) : reportsError ? (
                            <div className="text-center py-8">
                                <p className="text-red-500">Error loading reports: {reportsError}</p>
                            </div>
                        ) : recentReports.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No previous reports found. Create your first report!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recentReports.map((report) => {
                                    const reportDate = new Date(report.year, 0, 1 + (report.calendarWeek - 1) * 7);
                                    const highlight = report.notes ? 
                                        (report.notes.length > 50 ? report.notes.substring(0, 50) + "..." : report.notes) :
                                        `Week ${report.calendarWeek}, ${report.year}`;
                                    
                                    return (
                                        <Card
                                            key={`${report.year}-${report.calendarWeek}`}
                                            className="rounded-2xl border border-gray-200 hover:shadow-md hover:scale-[1.03] transition-all duration-200 bg-white cursor-pointer"
                                            onClick={() => onViewReport?.(report)}
                                        >
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg text-gray-800">
                                                        {highlight}
                                                    </CardTitle>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onViewReport?.(report);
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <CardDescription className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Week {report.calendarWeek}, {report.year}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <span>Categories:</span>
                                                        <span>{Object.keys(report.scores).length}</span>
                                                    </div>
                                                    {Object.entries(report.scores).slice(0, 3).map(([category, score]) => (
                                                        <div key={category} className="flex items-center justify-between text-xs">
                                                            <span className="text-gray-700">{category}</span>
                                                            <span className="font-medium">{score}/10</span>
                                                        </div>
                                                    ))}
                                                    {Object.keys(report.scores).length > 3 && (
                                                        <div className="text-xs text-gray-500">
                                                            +{Object.keys(report.scores).length - 3} more...
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

                <Card className="rounded-3xl bg-white shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-xl text-gray-900">API Call Debug Information</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                            Raw responses from integrated API calls.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 text-xs space-y-3">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-1">User Data (/users/me):</h4>
                            {userData !== null ? (
                                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md overflow-auto max-h-40">{userData}</pre>
                            ) : (
                                <p className="text-gray-500">Loading user data…</p>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-1">Health Check (/healthCheck):</h4>
                            {healthCheckData !== null ? (
                                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md overflow-auto max-h-40">{healthCheckData}</pre>
                            ) : (
                                <p className="text-gray-500">Loading health check data…</p>
                            )}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-1">GenAI Hello (/hello):</h4>
                            {genAiHelloData !== null ? (
                                <pre className="whitespace-pre-wrap bg-gray-100 p-2 rounded-md overflow-auto max-h-40">{genAiHelloData}</pre>
                            ) : (
                                <p className="text-gray-500">Loading GenAI data…</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
