import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({ values, labels }) {
  if (values.length !== labels.length) {
    return <div></div>;
  }

  const data = [];
  labels.forEach((label: any, index: any) => {
    data.push({ id: index, value: values[index], label: label.substring(0, 20) });
  });

  return (
    <PieChart
      series={[
        {
          data,
        },
      ]}
      width={550}
      height={200}
    />
  );
}
