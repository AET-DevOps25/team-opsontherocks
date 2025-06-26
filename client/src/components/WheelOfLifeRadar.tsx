"use client";

import React from "react";
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CategoryValue } from "@/types/categories";
import { DraggableRadarDot } from "@/components/DraggableRadarDot";

interface Props {
    categories?: CategoryValue[];
    onChange: (idx: number, name: string, value: number) => void;
}

export const WheelOfLifeRadar: React.FC<Props> = ({
                                                      categories = [],
                                                      onChange,
                                                  }) => {
    const safeCats = Array.isArray(categories) ? categories : [];

    const data = safeCats.map((c) => ({
        category: c.name,
        value: c.value,
        color: c.color,
    }));

    const renderDot = (props: any) => {
        const { index } = props as { index: number };
        const slice = safeCats[index];
        if (!slice) return null;

        return (
            <DraggableRadarDot
                {...props}
                index={index}
                total={safeCats.length}
                color={slice.color}
                onChange={(v: number) => onChange(index, slice.name, v)}
            />
        );
    };

    const renderAngleTick = ({ payload, x, y }: any) => (
        <text
            x={x}
            y={y}
            textAnchor="middle"
            fill="#222"
            fontSize={14}
            fontWeight="bold"
            style={{ cursor: "default" }}
        >
            {payload.value}
        </text>
    );

    return (
        <div className="flex w-full flex-col items-center mb-10">
            <div className="relative w-full max-w-4xl min-h-[550px] rounded-3xl bg-white/80 p-6 shadow-xl backdrop-blur">
                <ResponsiveContainer width="100%" height={500} minWidth={400}>
                    <RadarChart data={data}>
                        <PolarGrid strokeDasharray="4 4" />
                        <PolarAngleAxis dataKey="category" tick={renderAngleTick} />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 10]}
                            axisLine={false}
                            tickCount={6}
                            tick={{ fontSize: 12 }}
                        />
                        <Radar
                            dataKey="value"
                            dot={renderDot as any}
                            fillOpacity={0.13}
                            stroke="#6366f1"
                            fill="#6366f1"
                            isAnimationActive={false}
                        />
                        <Tooltip
                            formatter={(v: number | string) => v}
                            labelFormatter={(c: string) => `Category: ${c}`}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
