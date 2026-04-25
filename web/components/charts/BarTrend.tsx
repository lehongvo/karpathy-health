"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Point {
  date: string;
  value: number;
}

export function BarTrend({ data, height = 220 }: { data: Point[]; height?: number }) {
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" stroke="var(--border)" />
          <XAxis dataKey="date" stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <YAxis stroke="var(--muted)" fontSize={10} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" fill="var(--color-accent)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
