"use client";

import React from "react";
import {
    PolarAngleAxis,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
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
        if(readOnly) return null; // Only hide interactivity when explicitly told
        
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

    const renderAngleTick = ({ payload, x, y }: any) => {
        const RADIAN = Math.PI / 180;
        const radiusOffset = 20;
        const angle = payload.coordinate;

        const deltaX = Math.cos(-angle * RADIAN) * radiusOffset;
        const deltaY = Math.sin(-angle * RADIAN) * radiusOffset;

        return (
            <text
                x={x + deltaX}
                y={y + deltaY}
                textAnchor="middle"
                fill="#222"
                fontSize={14}
                fontWeight="bold"
                style={{ cursor: "default" }}
            >
                {payload.value}
            </text>
        );
    };

    return (
        <div className="flex w-full flex-col items-center mb-10">
            <div className="relative w-full max-w-4xl min-h-[550px] rounded-3xl focus:outline-none outline-none">
                <ResponsiveContainer width="100%" height={500} minWidth={400}>
                    <RadarChart data={data}>
                        <defs>
                            <linearGradient id="radarGradient" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.5} />
                                <stop offset="50%" stopColor="#06B6D4" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#10B981" stopOpacity={0.6} />
                            </linearGradient>
                        </defs>

                        <PolarGrid stroke="#5c5c6b" strokeDasharray="4 4" />
                        <PolarAngleAxis dataKey="category" tick={renderAngleTick} />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 10]}
                            axisLine={false}
                            tickCount={6}
                            tick={{ fontSize: 12 }}
                            stroke="#5c5c6b"
                        />
                        <Radar
                            dataKey="value"
                            dot={renderDot as any}
                            activeDot={false} // ✅ this disables the extra hover circle
                            fill="url(#radarGradient)"
                            fillOpacity={1}
                            stroke="#6366f1"
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
