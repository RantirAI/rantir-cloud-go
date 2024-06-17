/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const card = (userQuestion: string, aIAnswer: string, nextQuestion: string, onQuestionClick: any, aiQType: string) => (
  <React.Fragment>
    <CardContent>
      <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'blue', textTransform: 'uppercase' }}>{aiQType}</div>
      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{userQuestion}</div>

      <Typography variant="body2">{aIAnswer}</Typography>
    </CardContent>
    <CardActions>
      <Button
        size="small"
        style={{
          color: 'blue',
          textTransform: 'capitalize',
          textAlign: 'left',
          justifyItems: 'center',
        }}
        onClick={onQuestionClick}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-circle-chevron-right"
            style={{ marginBottom: '3px' }}
          >
            <circle cx="12" cy="12" r="10" />
            <path d="m10 8 4 4-4 4" />
          </svg>
          <span style={{ color: 'gray', fontSize: '12px', textTransform: 'capitalize' }}>{nextQuestion}</span>
        </div>
      </Button>

      <br />
    </CardActions>
  </React.Fragment>
);

export default function OutlinedCard({ userQuestion, aIAnswer, nextQuestion, onQuestionClick, aiQType }) {
  return (
    <Box sx={{ width: 550 }}>
      <Card variant="outlined" style={{ borderWidth: '0px' }}>
        {card(userQuestion, aIAnswer, nextQuestion, onQuestionClick, aiQType)}
      </Card>
    </Box>
  );
}
