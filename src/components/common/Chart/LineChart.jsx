"use client";

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
import { useEffect, useState } from "react";

export const LineChartComponent = (data) => {
  const [salesData, setData] = useState([]);
  useEffect(() => {
    setData(data.data);
    // setTimeout(() => { }, 1000);
  }, [data]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={700}
        height={300}
        data={salesData}
        margin={{
          right: 30,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="woa" name="Activos" stroke="#4ABD44" />
        <Line type="monotone" dataKey="woc" name="Cerrados" stroke="#D64D50" />
        <Line type="monotone" dataKey="op" name="Partes" stroke="#615991" />
        <Line type="monotone" dataKey="ot" name="Trabajos" stroke="#175D8F" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-slate-900 flex flex-col gap-4 rounded-md">
        <p className="text-medium text-lg">{label}</p>
        <p className="text-sm text-blue-400">
          Activos:
          <span className="ml-2">{payload[0].value}</span>
        </p>
        <p className="text-sm text-indigo-400">
          Cerrados:
          <span className="ml-2">{payload[1].value}</span>
        </p>
        <p className="text-sm text-indigo-400">
          Partes:
          <span className="ml-2">{payload[2].value}</span>
        </p>
        <p className="text-sm text-indigo-400">
          Salidas:
          <span className="ml-2">{payload[3].value}</span>
        </p>
      </div>
    );
  }
};
