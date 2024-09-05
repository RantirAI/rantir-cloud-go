import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export default function BasicTable({ labels, values }) {
  // ensure values are 2d array of equal length
  if (values.length === 0) {
    return <div></div>;
  }
  const len = values[0].length;
  for (let i = 1; i < values.length; i++) {
    if (values[i].length !== len) {
      return <div></div>;
    }
  }

  // ensure columnNames is same length as values
  if (labels.length !== values.length) {
    return <div></div>;
  }

  return (
    <div style={{ height: 350, overflow: 'scroll' }}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {labels.map((name, index) => (
              <TableCell key={index}>{name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {values[0].map((row, index) => (
            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {labels.map((cell, cindex) => (
                <TableCell key={cindex}>{values[cindex][index]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
