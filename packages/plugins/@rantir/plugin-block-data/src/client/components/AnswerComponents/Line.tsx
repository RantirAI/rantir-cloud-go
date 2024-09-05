import { LineChart } from '@mui/x-charts/LineChart';
import React from 'react';

export default function Line() {
  const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const pData = [10, 15, 8, 12, 7, 13, 10];
  const uData = [5, 10, 5, 8, 3, 6, 4];

  return (
    <LineChart
      width={500}
      height={300}
      slotProps={{ legend: { hidden: true } }}
      series={[
        { data: pData, label: 'pv' },
        { data: uData, label: 'uv' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
    />
  );
}
