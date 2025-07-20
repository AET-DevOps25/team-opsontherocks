import React, {useEffect, useState} from "react";
import {getISOWeek} from "date-fns";
import {useReports} from "@/hooks/useReports";
import HeaderSection from "@/components/HeaderSection";
import WeeklyCheckInCard from "@/components/WeeklyCheckInCard";
import CategoryCharts from "@/components/CategoryCharts";
import RecentReports from "@/components/RecentReports";

export interface DashboardProps {
    onCreateReport: () => void;
    onOpenSettings: () => void;
    onViewReport?: (report: import("@/hooks/useReports").Report) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
                                                 onCreateReport,
                                                 onOpenSettings,
                                                 onViewReport,
                                             }) => {
    /* -------------------- reports -------------------- */
    const {
        reports,
        loading: reportsLoading,
        error: reportsError,
        getCurrentWeekReport,
    } = useReports();

    /* -------------------- week status -------------------- */
    const [currentWeekReport, setCurrentWeekReport] =
        useState<import("@/hooks/useReports").Report | null>(null);
    const [loadingCurrentWeek, setLoadingCurrentWeek] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoadingCurrentWeek(true);
                const r = await getCurrentWeekReport();
                setCurrentWeekReport(r);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            } finally {
                setLoadingCurrentWeek(false);
            }
        })();
    }, [getCurrentWeekReport]);

    /* -------------------- derived -------------------- */
    const currentWeek = getISOWeek(new Date());
    const currentYear = new Date().getFullYear();
    const recentReports = reports
        .filter((r) => !(r.calendarWeek === currentWeek && r.year === currentYear))
        .slice(0, 6);

    /* -------------------- render -------------------- */
    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-12">
                <HeaderSection onOpenSettings={onOpenSettings}/>

                <WeeklyCheckInCard
                    loadingCurrentWeek={loadingCurrentWeek}
                    currentWeekReport={currentWeekReport}
                    onCreateReport={onCreateReport}
                    onViewReport={onViewReport}
                />

                <CategoryCharts reports={reports}/>

                <RecentReports
                    reports={recentReports}
                    loading={reportsLoading}
                    error={reportsError}
                    onViewReport={onViewReport}
                />
            </div>
        </div>
    );
};

export default Dashboard;
