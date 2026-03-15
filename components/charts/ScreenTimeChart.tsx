"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { format, parseISO } from "date-fns";

interface ScreenTimeDataPoint {
  date: string;
  totalMinutes: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const h = Math.floor(d.totalMinutes / 60);
  const m = d.totalMinutes % 60;
  return (
    <div className="bg-white border border-[#ede9e2] rounded-xl px-3 py-2 shadow-lg">
      <p className="text-xs text-[#8a8578]">{format(parseISO(d.date), "EEE, MMM d")}</p>
      <p className="text-sm font-medium text-[#3d3a35]">
        {h > 0 ? `${h}h ` : ""}{m}m tracked
      </p>
    </div>
  );
};

export function ScreenTimeChart({ data }: { data: ScreenTimeDataPoint[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: format(parseISO(d.date), "EEE"),
  }));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }} barSize={20}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ede7" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "#b5ad9e" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f6f3ee" }} />
        <Bar dataKey="totalMinutes" fill="#9e6b5e" radius={[4, 4, 0, 0]} animationDuration={800} />
      </BarChart>
    </ResponsiveContainer>
  );
}
