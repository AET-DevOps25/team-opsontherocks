import React from "react";
import { Plus, Eye } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Props {
    loadingCurrentWeek: boolean;
    currentWeekReport: import("@/hooks/useReports").Report | null;
    onCreateReport: () => void;
    onViewReport?: (report: import("@/hooks/useReports").Report) => void;
}

const WeeklyCheckInCard: React.FC<Props> = ({
                                                loadingCurrentWeek,
                                                currentWeekReport,
                                                onCreateReport,
                                                onViewReport,
                                            }) => (
    <Card className="rounded-3xl bg-white shadow-lg border-none">
        <CardHeader>
            <CardTitle className="text-3xl text-gray-900">✨ Weekly Check-in</CardTitle>
            <CardDescription className="text-base text-gray-600">
                {loadingCurrentWeek
                    ? "Checking current week status..."
                    : currentWeekReport
                        ? "You've already submitted a report for this week."
                        : "It's time for your weekly reflection! Share how your week went."}
            </CardDescription>
        </CardHeader>

        <CardContent className="pt-4">
            {loadingCurrentWeek ? (
                <p className="text-center text-gray-500 py-8">Loading...</p>
            ) : currentWeekReport ? (
                <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center justify-between">
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

                    <Button
                        onClick={onCreateReport}
                        size="lg"
                        className="text-base sm:text-lg font-semibold px-8 py-4 rounded-2xl transition-transform duration-300 bg-purple-600 hover:bg-purple-500 hover:scale-105 text-white shadow-md hover:shadow-lg"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Update Report
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={onCreateReport}
                    size="lg"
                    className="text-base sm:text-lg font-semibold px-8 py-4 rounded-2xl transition-transform duration-300 bg-purple-600 hover:bg-purple-500 hover:scale-105 text-white shadow-md hover:shadow-lg"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Create Weekly Report
                </Button>
            )}
        </CardContent>
    </Card>
);

export default WeeklyCheckInCard;
