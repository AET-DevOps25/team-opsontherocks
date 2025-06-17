import React from "react";
import { Plus, Settings } from "lucide-react";
import { format, isAfter, startOfWeek, subWeeks } from "date-fns";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useTestEndpoints } from "@/api/testEndpoints.tsx";

interface DashboardProps {
    onCreateReport: () => void;
    onOpenSettings: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onCreateReport, onOpenSettings }) => {
    const lastReportDate = subWeeks(new Date(), 1);
    const canCreateNewReport = isAfter(
        new Date(),
        startOfWeek(lastReportDate, { weekStartsOn: 1 })
    );

    const recentReports = [
        {
            date: "2024-01-15",
            highlight: "Report highlight 1",
        },
        {
            date: "2024-01-08",
            highlight: "Report highlight 2",
        },
        {
            date: "2024-01-01",
            highlight: "Repot highlight 3",
        },
    ];

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
                            {canCreateNewReport
                                ? "It's time for your weekly reflection! Share how your week went."
                                : `Next check-in available on ${format(
                                    startOfWeek(new Date(), { weekStartsOn: 1 }),
                                    "EEEE, MMM dd"
                                )}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <Button
                            onClick={onCreateReport}
                            disabled={!canCreateNewReport}
                            size="lg"
                            className={`text-base sm:text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 ease-out ${
                                canCreateNewReport
                                    ? "bg-purple-600 hover:bg-purple-500 hover:scale-105 text-white shadow-md hover:shadow-lg"
                                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                            }`}
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            {canCreateNewReport ? "Create Weekly Report" : "Report Submitted"}
                        </Button>
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
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentReports.map((report) => (
                            <Card
                                key={report.date}
                                className="rounded-2xl border border-gray-200 hover:shadow-md hover:scale-[1.03] transition-all duration-200 bg-white"
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg text-gray-800">
                                        {report.highlight}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        {format(new Date(report.date), "MMM dd, yyyy")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-700"></p>
                                </CardContent>
                            </Card>
                        ))}
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
