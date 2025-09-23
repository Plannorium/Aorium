import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
interface DataPoint {
  name: string;
  value: number;
  [key: string]: any;
}
interface LineChartProps {
  data: DataPoint[];
  dataKey: string;
  xAxisDataKey?: string;
  color?: string;
  height?: number;
  className?: string;
  showGrid?: boolean;
}
const LineChart = ({
  data,
  dataKey,
  xAxisDataKey = 'name',
  color = '#d4af37',
  height = 300,
  className = '',
  showGrid = true
}: LineChartProps) => {
  return <div className={`w-full ${className}`} style={{
    height
  }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data} margin={{
        top: 10,
        right: 30,
        left: 20,
        bottom: 10
      }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />}
          <XAxis dataKey={xAxisDataKey} tick={{
          fill: '#f3e9dc',
          fontSize: 12
        }} axisLine={{
          stroke: 'rgba(255,255,255,0.1)'
        }} tickLine={false} dy={10} />
          <YAxis tick={{
          fill: '#f3e9dc',
          fontSize: 12
        }} axisLine={{
          stroke: 'rgba(255,255,255,0.1)'
        }} tickLine={false} dx={-10} />
          <Tooltip contentStyle={{
          backgroundColor: '#071a3a',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          borderRadius: '8px',
          color: '#f3e9dc',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
        }} itemStyle={{
          color: color
        }} labelStyle={{
          color: '#f3e9dc',
          fontWeight: 'bold',
          marginBottom: '5px'
        }} cursor={{
          stroke: 'rgba(255,255,255,0.2)'
        }} />
          <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} dot={{
          fill: color,
          strokeWidth: 2,
          r: 4,
          stroke: '#071a3a'
        }} activeDot={{
          r: 6,
          fill: color,
          stroke: '#071a3a',
          strokeWidth: 2
        }} name="Value" connectNulls={true} animationDuration={1500} animationEasing="ease-in-out" fill="url(#colorGradient)" />
          <Legend wrapperStyle={{
          color: '#f3e9dc',
          fontSize: '12px',
          paddingTop: '10px'
        }} />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>;
};
export default LineChart;