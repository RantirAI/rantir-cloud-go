import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Typewriter } from 'react-simple-typewriter';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';

import DateCalendarValue from './Date';
import BasicPie from './Pie';
import DataGridDemo from './DataGrid';
import BasicScatter from './Scatter';
import BasicTimeline from './TimeLine';
import Bar from './Bar';
import Line from './Line';
import BasicTable from './Table';

const card = (
  aIAnswer: string,
  nextQuestion: string,
  onQuestionClick: any,
  aiQType: string,
  graph: string,
  graphData: any,
) => {
  let showGraph = false;
  let Chart;
  try {
    graphData = JSON.parse(graphData);
    const items = {
      bar: <Bar key={0} values={graphData.values} labels={graphData.labels} />,
      line: <Line key={1} />,
      list: <BasicTable key={2} labels={graphData.labels} values={graphData.values} />,
      cal: <DateCalendarValue key={3} />,
      pie: <BasicPie key={4} values={graphData.values} labels={graphData.labels} />,
      table_main: <DataGridDemo key={5} />,
      scatter: <BasicScatter key={6} x={graphData.x} y={graphData.y} labels={graphData.labels} />,
      timeline: <BasicTimeline key={7} values={graphData.values} labels={graphData.labels} />,
    };

    Chart = items[graph];
    showGraph = true;
  } catch (e) {
    showGraph = false;
  }

  return (
    <React.Fragment>
      <CardContent>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'blue', textTransform: 'uppercase' }}>{aiQType}</div>
        <Typography variant="body2">
          <Typewriter words={[aIAnswer]} typeSpeed={20} />
        </Typography>
        {showGraph && Chart ? <div style={{ marginTop: '1rem' }}>{Chart}</div> : null}
      </CardContent>
      {nextQuestion !== '' ? (
        <CardActions>
          <Button size="small" onClick={onQuestionClick}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'left', gap: '4px' }}>
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
        </CardActions>
      ) : null}
    </React.Fragment>
  );
};

export default function OutlinedCard({
  userQuestion,
  aIAnswer,
  nextQuestion,
  onQuestionClick,
  aiQType,
  graph,
  graphData,
}) {
  return (
    <Box sx={{ width: 550 }}>
      <Card variant="outlined" style={{ borderWidth: '0px' }}>
        {card(aIAnswer, nextQuestion, onQuestionClick, aiQType, graph, graphData)}
      </Card>
    </Box>
  );
}
