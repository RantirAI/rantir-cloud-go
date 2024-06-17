/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React from 'react';
import Bar from './Bar';
import Line from './Line';
import BasicTable from './Table';
import OutlinedCard from './Card';
import DateCalendarValue from './Date';
import BasicPie from './Pie';
import DataGridDemo from './DataGrid';
import BasicScatter from './Scatter';
import BasicTimeline from './TimeLine';

export const AIAnswer = ({ userQuestion, aIAnswer, nextQuestion, onQuestionClick, aiQType }) => {
  const styles = {
    answer: {
      marginTop: '2rem',
      border: '1px solid gainsboro',
      borderRadius: '0.5rem',
      padding: '1rem',
      width: 'auto',
      display: 'flex',
      flexFlow: 'column',
      alignItems: 'left',
    },
  };

  const items = [
    <Bar key={0} />,
    <Line key={1} />,
    <BasicTable key={2} />,
    <DateCalendarValue key={3} />,
    <BasicPie key={4} />,
    <DataGridDemo key={5} />,
    <BasicScatter key={6} />,
    <BasicTimeline key={7} />,
  ];
  const Chart = items[Math.floor(Math.random() * items.length)];

  return (
    <div style={styles.answer}>
      <OutlinedCard
        aiQType={aiQType}
        userQuestion={userQuestion}
        aIAnswer={aIAnswer}
        nextQuestion={nextQuestion}
        onQuestionClick={onQuestionClick}
      />
    </div>
  );
};
