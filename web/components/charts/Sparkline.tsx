"use client";

import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from "recharts";

interface Point {
  date: string;
  value: number;
}

export function Sparkline({
  data,
  color = "var(--color-text)",
  domain,
  height = 60,
}: {
  data: Point[];
  color?: string;
  domain?: [number, number];
  height?: number;
}) {
  return (
    <div style={{ height, width: "100%" }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <YAxis hide domain={domain ?? ["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 12,
              padding: "4px 8px",
            }}
            labelStyle={{ display: "none" }}
          />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
