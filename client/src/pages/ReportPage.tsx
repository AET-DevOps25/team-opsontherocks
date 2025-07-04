"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCategories } from "@/hooks/useCategories";
import { WheelOfLifeRadar } from "@/components/WheelOfLifeRadar";

export default function ReportPage() {
    const { values, setValues, loading, error } = useCategories();
    const [notes, setNotes] = useState("");

    const handleChange = (idx: number, name: string, value: number) => {
        setValues((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], name, value };
            return next;
        });
    };

    const handleGenerateReport = () => {
        console.log("[ReportPage] Full Report:");
        console.log("Radar Values:", values);
        console.log("User Notes:", notes);
    };

    if (loading) return <p className="p-6 text-gray-500">Loading…</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <div className="relative min-h-screen w-full bg-gray-50">
            <main className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-12">
                {/* Header with top Generate Report button */}
                <header className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Progress Report</h1>
                        <p className="text-base text-gray-600">Fine-tune your life balance below.</p>
                    </div>
                    <Button
                        onClick={handleGenerateReport}
                        className="h-9 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition"
                    >
                        <FileText className="mr-2 h-4 w-4" /> Generate Report
                    </Button>
                </header>

                <WheelOfLifeRadar categories={values} onChange={handleChange} />

                {/* Notes section with second Generate Report button */}
                <section className="space-y-4">
                    <label htmlFor="notes" className="block text-lg font-semibold text-gray-800">
                        Notes or Reflections
                    </label>
                    <Textarea
                        id="notes"
                        placeholder="Write your reflections, goals, or insights..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[120px] bg-white shadow-sm"
                    />
                    <div className="flex justify-end">
                        <Button
                            onClick={handleGenerateReport}
                            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition"
                        >
                            <FileText className="mr-2 h-4 w-4" /> Generate Report
                        </Button>
                    </div>
                </section>
            </main>
        </div>
    );
}
