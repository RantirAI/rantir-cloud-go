import { BarChart } from '@mui/x-charts/BarChart';
import React from 'react';

export default function bar({ values, labels }) {
  if (values.length !== labels.length) {
    return <div></div>;
  }

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: labels }]}
      series={[{ data: values }]}
      width={500}
      height={300}
      slotProps={{ legend: { hidden: true } }}
    />
  );
}
