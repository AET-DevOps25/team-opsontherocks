"use client";

import React, {useState, useEffect} from "react";
import {FileText} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {useCategories} from "@/hooks/useCategories";
import {WheelOfLifeRadar} from "@/components/WheelOfLifeRadar";
import {getISOWeek} from "date-fns";
import {CategoryValue} from "@/types/categories";

const SERVER = import.meta.env.VITE_SERVER_URL as string | undefined;

interface ReportPageProps {
    initialData?: CategoryValue[];
    initialNotes?: string;
    onBack?: () => void;
}

export default function ReportPage({ initialData, initialNotes = "", onBack }: ReportPageProps) {
    const {values: fetchedValues, setValues: setFetchedValues, loading, error} = useCategories();
    const [values, setValues] = useState<CategoryValue[]>(initialData || []);
    const [notes, setNotes] = useState(initialNotes);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    // If no initial data is provided, use the fetched data
    useEffect(() => {
        if (!initialData && fetchedValues.length > 0) {
            setValues(fetchedValues);
        }
    }, [initialData, fetchedValues]);

    // If initial data is provided, use it immediately
    useEffect(() => {
        if (initialData) {
            setValues(initialData);
        }
    }, [initialData]);

    const handleChange = (idx: number, name: string, value: number) => {
        setValues((prev) => {
            const next = [...prev];
            next[idx] = {...next[idx], name, value};
            return next;
        });
    };

    const handleGenerateReport = async () => {
        const week = getISOWeek(new Date());
        const year = new Date().getFullYear();

        const scores = values.reduce((acc: Record<string, number>, curr) => {
            acc[curr.name] = curr.value;
            return acc;
        }, {});

        const payload = {
            calendarWeek: week,
            year,
            notes,
            scores
        };

        try {
            setSubmitting(true);
            const response = await fetch(`${SERVER}/users/me/reports`, {
                method: "POST",
                credentials: "include", // still needed if session-based
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.error || "Failed to submit report.");
            }

            setSubmitMessage("✅ Full report submitted successfully.");
        } catch (err: any) {
            console.error("[handleGenerateReport]", err);
            setSubmitMessage(`❌ ${err.message || "An unexpected error occurred."}`);
        } finally {
            setSubmitting(false);
        }
    };

    // Only show loading/error if no initial data is provided and we're fetching
    if (!initialData && loading) return <p className="p-6 text-gray-500">Loading…</p>;
    if (!initialData && error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <div className="relative min-h-screen w-full bg-gray-50">
            <main className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-12">
                <header className="mb-4 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Progress Report</h1>
                        <p className="text-base text-gray-600">Fine-tune your life balance below.</p>
                        <Button
                            variant="outline"
                            onClick={onBack || (() => (window.location.href = "/"))}
                            className="mt-4"
                        >
                            ← Back
                        </Button>
                    </div>

                    <Button
                        onClick={handleGenerateReport}
                        disabled={submitting}
                        className="h-9 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition"
                    >
                        <FileText className="mr-2 h-4 w-4"/> Generate Report
                    </Button>
                </header>

                <WheelOfLifeRadar categories={values} onChange={handleChange}/>

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
                            disabled={submitting}
                            className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition"
                        >
                            <FileText className="mr-2 h-4 w-4"/> Generate Report
                        </Button>
                    </div>
                    {submitMessage && (
                        <p className="text-sm text-gray-700 italic">{submitMessage}</p>
                    )}

                    {reportGenerated && (
                        <div className="flex justify-end">
                            <Button
                                onClick={() => navigate("/results")}
                                className="mt-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow hover:scale-105 transition"
                            >
                                Show Results →
                            </Button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
