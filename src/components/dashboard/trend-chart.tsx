"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip
} from "@/components/ui/chart";

interface TrendChartProps {
  data: any[];
}

const chartConfig = {
  temperature: {
    label: "Temp (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
};

export function TrendChart({ data }: TrendChartProps) {
  return (
    <ChartContainer config={chartConfig} className="w-full h-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
          <XAxis
            dataKey="time"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            cursor={true}
            content={
              <ChartTooltipContent
                indicator="dot"
                labelClassName="text-background"
                className="bg-popover text-popover-foreground border-border/50 shadow-lg"
              />
            }
          />
          <Legend content={<ChartLegendContent />} />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="var(--color-temperature)"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="var(--color-humidity)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
