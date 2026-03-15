"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getMoodEmoji, getMoodLabel } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface MoodDataPoint {
  date: string;
  mood: number | null;
}

interface MoodChartProps {
  data: MoodDataPoint[];
}

const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.mood === null || payload.mood === undefined) return null;
  return (
    <text x={cx} y={cy + 5} textAnchor="middle" fontSize={14}>
      {getMoodEmoji(payload.mood)}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  if (d.mood === null) return null;

  return (
    <div className="bg-white border border-[#ede9e2] rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-[#8a8578]">
        {format(parseISO(d.date), "EEE, MMM d")}
      </p>
      <p className="text-sm font-medium text-[#3d3a35]">
        {getMoodEmoji(d.mood)} {getMoodLabel(d.mood)}
      </p>
    </div>
  );
};

export function MoodChart({ data }: MoodChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    moodInverted: d.mood !== null ? 5 - d.mood : null,
    label: format(parseISO(d.date), "EEE"),
  }));

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={chartData} margin={{ top: 20, right: 8, bottom: 0, left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede7" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#b5ad9e" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide domain={[0, 5]} />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="moodInverted"
          stroke="#8b7bb5"
          strokeWidth={2}
          dot={<CustomDot />}
          activeDot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
