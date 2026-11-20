'use client';

import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useTheme } from 'next-themes';

export interface HealthDataPoint {
  day: string;
  verified: number;
  flagged: number;
  resolved: number;
}

export function BrandHealthChart({ data }: { data?: HealthDataPoint[] }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  const chartData = data && data.length > 0 ? data : [
    { day: 'Mon', verified: 0, flagged: 0, resolved: 0 },
    { day: 'Tue', verified: 0, flagged: 0, resolved: 0 },
    { day: 'Wed', verified: 0, flagged: 0, resolved: 0 },
    { day: 'Thu', verified: 0, flagged: 0, resolved: 0 },
    { day: 'Fri', verified: 0, flagged: 0, resolved: 0 },
    { day: 'Sat', verified: 0, flagged: 0, resolved: 0 },
    { day: 'Sun', verified: 0, flagged: 0, resolved: 0 },
  ];

  const isDark = resolvedTheme === 'dark';
  const textColor = isDark ? '#A3A3A3' : '#545B4E';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const tooltipBg = isDark ? '#121212' : '#FFFCF6';
  const tooltipBorder = isDark ? '#262626' : '#E8DFD0';
  const tooltipText = isDark ? '#EDEDED' : '#242820';

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          barGap={6}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
          <XAxis
            dataKey="day"
            tick={{ fill: textColor, fontSize: 11, fontWeight: 500 }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: textColor, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: tooltipBg,
              borderColor: tooltipBorder,
              borderRadius: '12px',
              color: tooltipText,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              fontSize: '12px',
              padding: '10px 14px',
            }}
            labelStyle={{ fontWeight: 600, color: tooltipText, marginBottom: '4px' }}
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '16px', fontSize: '11px', color: textColor }}
          />
          <Bar
            name="Compliant Claims"
            dataKey="verified"
            fill={isDark ? '#10B981' : '#123B2F'}
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            name="Policy Flags"
            dataKey="flagged"
            fill="#F47745"
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
          <Bar
            name="1-Click Fixed"
            dataKey="resolved"
            fill={isDark ? '#34D399' : '#174C3B'}
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BrandHealthChart;
