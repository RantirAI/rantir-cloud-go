import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, { timelineOppositeContentClasses } from '@mui/lab/TimelineOppositeContent';

export default function BasicTimeline({ values, labels }) {
  if (values.length !== labels.length) {
    return <div></div>;
  }

  return (
    <Timeline style={{ minWidth: '20rem' }}>
      {labels.map((label, index) => (
        <TimelineItem key={index}>
          <TimelineOppositeContent color="textSecondary">{values[index]}</TimelineOppositeContent>
          <TimelineSeparator>
            <TimelineDot />
            <TimelineConnector />
          </TimelineSeparator>
          <TimelineContent>{label}</TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
