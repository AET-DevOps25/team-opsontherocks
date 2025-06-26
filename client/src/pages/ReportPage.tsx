"use client";

import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useCategories";
import {WheelOfLifeRadar} from "@/components/WheelOfLifeRadar";

export default function ReportPage() {
    const { values, setValues, loading, error } = useCategories();

    const handleChange = (idx: number, name: string, value: number) => {
        setValues((prev) => {
            const next = [...prev];
            next[idx] = { ...next[idx], name, value };
            return next;
        });
    };

    const handleSave = () => {
        // eslint-disable-next-line no-console
        console.log("[ReportPage] current radar values", values);
        // TODO: POST/PATCH to backend when endpoint is ready
    };

    if (loading) return <p className="p-6 text-gray-500">Loading…</p>;
    if (error) return <p className="p-6 text-red-600">{error}</p>;

    return (
        <div className="relative min-h-screen w-full bg-gray-50">
            {/* animated backdrop */}
            <div
                aria-hidden
                className="pointer-events-none absolute -inset-0.5 z-0 rounded-[3rem] blur-3xl opacity-40"
                style={{
                    background: "radial-gradient(circle at 30% 30%, #6366f188, transparent 70%)",
                }}
            />
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0.5 z-0 animate-orbit opacity-60"
                style={{
                    background:
                        "linear-gradient(70deg, #8B5CF6AA 0%, #06B6D4DD 40%, #10B98122 60%, #F59E0BDD 90%)",
                    backgroundSize: "300% 300%",
                    filter: "blur(6px)",
                }}
            />

            <main className="relative z-10 mx-auto max-w-5xl space-y-10 px-4 py-12">
                <header className="mb-4 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Progress Report</h1>
                        <p className="text-base text-gray-600">
                            Fine-tune your life balance below.
                        </p>
                    </div>
                    <Button
                        onClick={handleSave}
                        className="h-9 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white shadow hover:scale-105 transition"
                    >
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </header>

                <WheelOfLifeRadar categories={values} onChange={handleChange} />
            </main>
        </div>
    );
}
