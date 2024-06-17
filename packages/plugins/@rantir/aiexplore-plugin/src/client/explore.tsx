/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { AIAnswer } from './components/AnswerComponents/Answer';
import { chooseCollectionGivenQuestion, getAIAnswer } from './utils/AI';

const AIExplore = ({ sitesData, pagesData, token }) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [allAnswers, setAllAnswers] = useState([]);

  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [allAnswers]);

  const styles = {
    main: {
      padding: '1rem',
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
      color: 'black',
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
    },
    byline: {
      color: 'gray',
      fontSize: '0.8rem',
    },
    suggestionHolder: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gridTemplateRows: 'repeat(2, 1fr)',
      gap: '10px',
      marginTop: '1rem',
      marginBottom: '2rem',
    },
    promptSuggestion: {
      backgroundColor: 'whitesmoke',
      padding: '0.8rem',
      cursor: 'pointer',
    },
    userInput: {
      display: 'flex',
      margin: '1rem',
    },
    textBox: {
      height: '3rem',
      borderRight: '0px',
      width: '30rem',
      paddingLeft: '1rem',
      outline: 'none',
    },
    button: {
      backgroundColor: 'black',
      color: 'white',
      height: '3rem',
      width: '6rem',
    },
    footer: {
      marginTop: '4rem',
    },
    footerMessage: {
      display: 'flex',
      gap: '0.5rem',
      backgroundColor: '#E5EFFD',
      border: '1px solid #B5D1FA',
      color: '#395263',
      package: '0.8rem',
    },
  };

  const suggestedPrompts = [
    'How many sites do I have?',
    'When was my site last updated?',
    'Did I work on a page in April?',
    'How was publishing this Month?',
  ];

  const handleSubmit = async (event) => {
    // change opacity for 5 seconds
    event.target.style.opacity = 0.5;
    setTimeout(() => {
      event.target.style.opacity = 1;
    }, 200);

    setIsLoading(true);
    const chosenCollection = await chooseCollectionGivenQuestion(inputValue, sitesData, pagesData);
    const { answer, nextQuestion } = await getAIAnswer(chosenCollection, inputValue, token, sitesData, pagesData);

    setAllAnswers([...allAnswers, { answer, nextQuestion, question: inputValue, topic: chosenCollection.type }]);
    setIsLoading(false);
  };

  const detectEnterOrTab = (event) => {
    // check if key pressed is enter
    if (event.key === 'Enter') {
      handleSubmit(event);
    }
    // check if key pressed is tab
    if (event.key === 'Tab') {
      const question = 'How many sites do I have?';
      setInputValue(question);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const autoSubmit = async (question) => {
    setInputValue(question);
    setIsLoading(true);
    const chosenCollection = await chooseCollectionGivenQuestion(question, sitesData, pagesData);
    const { answer, nextQuestion } = await getAIAnswer(chosenCollection, question, token, sitesData, pagesData);

    setAllAnswers([...allAnswers, { answer, nextQuestion, question, topic: chosenCollection.type }]);
    setIsLoading(false);
  };

  return (
    <div>
      <div style={styles.main}>
        <h1 style={styles.heading}>Explore your Data</h1>
        <h3 style={styles.byline}>To start a new chat, either select a preconfigured question or enter a prompt.</h3>
        {inputValue === '' && allAnswers.length < 1 ? (
          <div>
            <div style={styles.suggestionHolder}>
              {suggestedPrompts.map((item, index) => (
                <div onClick={() => autoSubmit(item)} style={styles.promptSuggestion} key={index}>
                  {item}
                </div>
              ))}
            </div>
            <h4 style={styles.byline}>
              And our finetuning model to help discover your data. Please reference all hallucinations to
              support@rantir.com.
            </h4>
          </div>
        ) : (
          <div></div>
        )}

        <div style={styles.userInput}>
          <input
            style={styles.textBox}
            type="text"
            value={inputValue}
            onKeyDown={detectEnterOrTab}
            onChange={handleInputChange}
            placeholder="Ask a question or prompt"
          />
          <button onClick={handleSubmit} style={styles.button}>
            {isLoading ? <CircularProgress color={'inherit'} size={20} /> : 'Ask'}
          </button>
        </div>

        <div ref={containerRef} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '1rem' }}>
          {allAnswers.map((item, index) => (
            <AIAnswer
              key={index}
              aiQType={item.topic}
              userQuestion={item.question}
              aIAnswer={item.answer}
              nextQuestion={item.nextQuestion}
              onQuestionClick={() => autoSubmit(item.nextQuestion)}
            />
          ))}
        </div>
      </div>
      <div style={styles.footer}>
        <div style={styles.footerMessage}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            <path d="M13 12a2 2 0 0 0 2-2V8H8" />
            <path d="M14 12a2 2 0 0 0 2-2V8h-2" />
          </svg>
          <span>Ask one question at a time and start new chats for new topics. </span>
        </div>
      </div>
    </div>
  );
};

AIExplore.propTypes = {
  sitesData: PropTypes.object.isRequired,
};

export default AIExplore;
