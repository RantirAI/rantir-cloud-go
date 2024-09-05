import React from 'react';
import OutlinedCard from './Card';

export const AIAnswer = ({ userQuestion, aIAnswer, nextQuestion, graph, graphData, onQuestionClick, aiQType }) => {
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

  return (
    <div>
      <div style={styles.answer}>
        <OutlinedCard
          graph={graph}
          graphData={graphData}
          aiQType={aiQType}
          userQuestion={userQuestion}
          aIAnswer={aIAnswer}
          nextQuestion={nextQuestion}
          onQuestionClick={onQuestionClick}
        />
      </div>
    </div>
  );
};
