import React from "react";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}
interface BarChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisDataKey?: string;
  color?: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
}
const BarChart = ({
  data,
  dataKey,
  xAxisDataKey = "name",
  color = "#d4af37",
  height = 300,
  className = "",
  showGrid = true,
}: BarChartProps) => {
  // Generate lighter and darker variants of the base color for hover effect
  interface GetColorFn {
    (index: number): string;
  }

  const getColor: GetColorFn = (index: number): string => {
    if (color === "#90b1d3") {
      // For secondary color
      const colors: string[] = [
        "#7ca3cc",
        "#90b1d3",
        "#a4bfda",
        "#b8cde1",
        "#ccdbe8",
      ];
      return colors[index % colors.length];
    } else {
      // For gold color
      const colors: string[] = [
        "#c9a22f",
        "#d4af37",
        "#debb4f",
        "#e8c767",
        "#f2d37f",
      ];
      return colors[index % colors.length];
    }
  };
  return (
    <div
      className={`w-full ${className}`}
      style={{
        height,
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
          barGap={8}
          barCategoryGap={16}
        >
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={1} />
              <stop offset="100%" stopColor={color} stopOpacity={0.6} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
          )}
          <XAxis
            dataKey={xAxisDataKey}
            tick={{
              fill: "#f3e9dc",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "rgba(255,255,255,0.1)",
            }}
            tickLine={false}
            dy={10}
          />
          <YAxis
            tick={{
              fill: "#f3e9dc",
              fontSize: 12,
            }}
            axisLine={{
              stroke: "rgba(255,255,255,0.1)",
            }}
            tickLine={false}
            dx={-10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#071a3a",
              border: "1px solid rgba(212, 175, 55, 0.3)",
              borderRadius: "8px",
              color: "#f3e9dc",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            cursor={{
              fill: "rgba(255,255,255,0.05)",
            }}
            itemStyle={{
              color: color,
            }}
            labelStyle={{
              color: "#f3e9dc",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          />
          <Legend
            wrapperStyle={{
              color: "#f3e9dc",
              fontSize: "12px",
              paddingTop: "10px",
            }}
          />
          <Bar
            dataKey={dataKey}
            radius={[4, 4, 0, 0]}
            fillOpacity={0.9}
            name="Value"
            animationDuration={1500}
            animationEasing="ease-in-out"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
export default BarChart;
