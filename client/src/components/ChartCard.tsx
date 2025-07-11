import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const COLORS = [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#F97316",
    "#A855F7",
    "#22C55E",
];

const getColor = (name: string) => {
    const hash = Math.abs(
        name.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)
    );
    return COLORS[hash % COLORS.length];
};

interface Props {
    title: string;
    data: any[];
    subCategories: string[];
}

const ChartCard: React.FC<Props> = ({ title, data, subCategories }) => (
    <div className="h-64 w-full">
        <h4 className="text-base font-semibold mb-2 text-gray-700">{title}</h4>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" fontSize={12} />
                <YAxis domain={[0, 10]} fontSize={12} />
                <Tooltip wrapperClassName="!text-xs" />
                <Legend wrapperStyle={{ fontSize: "0.75rem" }} />
                {subCategories.map((sc) => (
                    <Line
                        key={sc}
                        type="monotone"
                        dataKey={sc}
                        stroke={getColor(sc)}
                        strokeWidth={2}
                        dot={false}
                        connectNulls
                    />
                ))}
                <Line
                    type="monotone"
                    dataKey="Average"
                    stroke="#000"
                    strokeWidth={3}
                    dot={false}
                    connectNulls
                />
            </LineChart>
        </ResponsiveContainer>
    </div>
);

export default ChartCard;
