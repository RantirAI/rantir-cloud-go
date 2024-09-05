import React, { FC, useEffect, useRef, useState } from 'react';
import { withDynamicSchemaProps } from '@nocobase/client';
import { BlockName } from '../constants';
import './styles.css';
import { styles } from './styles';
import Typewriter from './Typewriter';

import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { AIAnswer } from './AnswerComponents/Answer';
import {
  addLog,
  getAIAnswer,
  getAIQuestions,
  getFirstChats,
  getLogs,
  isVectorSetup,
  setUpBatchVectors,
  setUpVectors,
} from './utils/AI';
import { getCollection, getCollectionFields, isValidDate } from './data/DBFunctions';

export interface InfoProps {
  token: string;
  collectionName: string;
  data?: any[];
  loading?: boolean;
}
const suggestedPrompts = [
  'What was the combined percent gain for the trade that opened on August 29, 2008?',
  'Which trade had the highest net gain, and what was its value?',
  'How many days did the trade that opened on March 16, 2007 last?',
  'What was the ticker symbol for the second instrument in the trade that closed on November 9, 2007?',
];

export const AiExplore: FC<InfoProps> = withDynamicSchemaProps(
  ({ collectionName, data, token, loading }) => {
    console.log({ data, token });
    if (loading) return;

    const [inputValue, setInputValue] = useState('');
    const [chatNo, setChatNo] = useState(1);
    const [chatId, setChatId] = useState(crypto.randomUUID());
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingBD, setDBLoading] = useState(false);
    const [allAnswers, setAllAnswers] = useState([]);
    const [historyChats, setHistoryChats] = useState([]);
    const [chosenCollection, setCollection] = useState(collectionName);
    const [chosenAI, setchosenAI] = useState('Claude AI');
    const [topics, setTopics] = useState([]);
    const [suggestedPrompts, setSuggestedPrompts] = useState(['...', '...', '...', '...']);
    const [backgroundColor, setBackgroundColor] = useState(null);

    const containerRef = useRef(null);
    useEffect(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, [allAnswers]);

    useEffect(() => {
      getFirstChats(chosenCollection)
        .then(({ results }) => {
          if (results.message === 'error') {
            setHistoryChats([]);
          } else {
            setHistoryChats(results);
          }
        })
        .catch((e) => {
          // console.log(e);
        });
    }, [chosenCollection, allAnswers]);

    const setUpDBforAI = async (collectionName: string) => {
      setDBLoading(true);

      if (data.length < 1) {
        setDBLoading(false);
        setTopics([]);
        setSuggestedPrompts(['...', '...', '...', '...']);
        return;
      }

      const vectorSetup = await isVectorSetup(collectionName);
      const allData = [];
      setSuggestedPrompts(['...', '...', '...', '...']);
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      if (vectorSetup.count === 0) {
        data.forEach((obj) => {
          let sent = '';

          for (const [key, value] of Object.entries(obj)) {
            const isDate = isValidDate(value as string);
            if (key?.includes(`{{t(`)) continue;

            if (isDate) {
              const dt = value as string;
              const date = new Date(dt);
              const formartedDate = formatter.format(date);
              sent += `${key} is ${formartedDate}. `;
            } else {
              sent += `${key} is ${value}. `;
            }
          }
          allData.push(sent);
        });

        let message = '';
        if (allData.length > 1000) {
          const result = await setUpBatchVectors(collectionName, allData);
          message = result.message;
        } else {
          const result = await setUpVectors(collectionName, allData);
          message = result.message;
        }

        if (message === 'success') {
          const allTopics = [];
          Object.keys(data[0]).forEach((key_) => {
            allTopics.push(key_);
          });

          setTopics(allTopics);
          const info = [];
          data.slice(0, 5).forEach((obj) => {
            let sent = '';

            for (const [key, value] of Object.entries(obj)) {
              const isDate = isValidDate(value as string);
              if (key?.includes(`{{t(`)) continue;

              if (isDate) {
                const dt = value as string;
                const date = new Date(dt);
                const formartedDate = formatter.format(date);
                sent += `${key} is ${formartedDate}. `;
              } else {
                sent += `${key} is ${value}. `;
              }
            }
            info.push({ doc: sent });
          });

          const { allQuestions } = await getAIQuestions(allTopics, 4, info, token);
          let suggestedQuestions: any = {};
          try {
            suggestedQuestions = JSON.parse(allQuestions);
            setSuggestedPrompts(suggestedQuestions.questions);
            setDBLoading(false);
          } catch (e) {
            //console.log(e);
          }
        }
      } else {
        const allTopics = [];
        Object.keys(data[0]).forEach((key_) => {
          allTopics.push(key_);
        });
        setTopics(allTopics);

        const info = [];
        data.slice(0, 5).forEach((obj) => {
          let sent = '';

          for (const [key, value] of Object.entries(obj)) {
            const isDate = isValidDate(value as string);
            if (key?.includes(`{{t(`)) continue;

            if (isDate) {
              const dt = value as string;
              const date = new Date(dt);
              const formartedDate = formatter.format(date);
              sent += `${key} is ${formartedDate}. `;
            } else {
              sent += `${key} is ${value}. `;
            }
          }
          info.push({ doc: sent });
        });

        const { allQuestions } = await getAIQuestions(allTopics, 4, info, token);
        let suggestedQuestions: any = {};
        try {
          suggestedQuestions = JSON.parse(allQuestions);
          setSuggestedPrompts(suggestedQuestions.questions);
          setDBLoading(false);
        } catch (e) {
          //console.log(e);
        }
      }
    };

    useEffect(() => {
      const getNavbarColor = () => {
        const navbar = document.querySelector('.ant-layout-header');
        if (navbar) {
          const color = window.getComputedStyle(navbar).backgroundColor;
          setBackgroundColor(color);
        }
      };

      // Wait for DOM to load
      if (document.readyState === 'complete') {
        getNavbarColor();
      } else {
        window.addEventListener('load', getNavbarColor);
        return () => window.removeEventListener('load', getNavbarColor);
      }
    }, []);

    useEffect(() => {
      setUpDBforAI(chosenCollection);
    }, []);

    const handleAiChange = async (event: SelectChangeEvent) => {
      setAllAnswers([]);
      setSuggestedPrompts(['...', '...', '...', '...']);

      setChatId(crypto.randomUUID());
      setChatNo(1);

      const collectionName = event.target.value;
      setCollection(collectionName);

      await setUpDBforAI(collectionName);
    };

    const handleNewChat = async () => {
      setAllAnswers([]);
      setSuggestedPrompts(['...', '...', '...', '...']);

      setChatId(crypto.randomUUID());
      setChatNo(1);

      await setUpDBforAI(chosenCollection);
    };

    const switchChat = async (chatId: any) => {
      const newAnswers = [];
      const historylogy = await getLogs(chosenCollection, chatId);
      // console.log(historylogy);

      historylogy.results.forEach((item) => {
        newAnswers.push({
          answer: item.answer,
          graphData: item.graphData,
          graphPrediction: item.graphPrediction,
          question: item.query,
          nextQuestion: '',
          topic: 'Rantir',
        });
      });

      setChatId(chatId);
      setAllAnswers([]);
      setAllAnswers(newAnswers);
      setChatNo(newAnswers.length + 1);
    };

    const handleSubmit = async (event) => {
      setIsLoading(true);
      const { answer, nextQuestion, graphData, graphPrediction } = await getAIAnswer(
        inputValue,
        topics,
        chosenCollection,
        token,
      );
      setChatNo(chatNo + 1);
      const isFirst = chatNo === 1 ? 'true' : 'false';
      addLog(chosenCollection, inputValue, answer, chatId, isFirst, graphData, graphPrediction);
      console.log(graphData, graphPrediction, 'graph');

      setAllAnswers([
        ...allAnswers,
        {
          answer,
          nextQuestion,
          graphPrediction,
          graphData,
          question: inputValue,
          topic: 'Rantir',
        },
      ]);
      setIsLoading(false);
      setInputValue('');
    };

    const detectEnterOrTab = (event) => {
      // check if key pressed is enter
      if (event.key === 'Enter') {
        handleSubmit(event);
      }
      // check if key pressed is tab
      if (event.key === 'Tab') {
        const question = suggestedPrompts[Math.floor(Math.random() * suggestedPrompts.length)];
        setInputValue(question);
      }
    };

    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };

    const autoSubmit = async (question) => {
      setInputValue(question);
      setIsLoading(true);
      const { answer, nextQuestion, graphData, graphPrediction } = await getAIAnswer(
        question,
        topics,
        chosenCollection,
        token,
      );
      setChatNo(chatNo + 1);
      const isFirst = chatNo === 1 ? 'true' : 'false';
      addLog(chosenCollection, question, answer, chatId, isFirst, graphData, graphPrediction);
      console.log(graphData, 'graph');

      setAllAnswers([
        ...allAnswers,
        {
          answer,
          nextQuestion,
          question,
          graphPrediction,
          graphData,
          topic: 'Rantir',
        },
      ]);
      setIsLoading(false);
      setInputValue('');
    };

    return (
      // <div>
      //   <div>collection: {collectionName}</div>
      //   <div>
      //     data list: <pre>{JSON.stringify(data, null, 2)}</pre>
      //   </div>
      // </div>

      <div
        style={{
          backgroundColor: 'white',
          display: 'flex',
        }}
      >
        <div style={styles.sidebar}>
          <span style={styles.sidebarHeading}>Chat History</span>
          <button style={{ ...styles.newChatbutton, backgroundColor }} onClick={handleNewChat}>
            New Chat
          </button>
          <div style={styles.chartholder}>
            {historyChats.map((item, index) => (
              <div key={index} style={styles.chatile} onClick={() => switchChat(item.chatid)}>
                <svg width="20" height="20" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12.1667 1.16663H2.83332C2.18991 1.16663 1.66666 1.68988 1.66666 2.33329V12.8333L4.77757 10.5H12.1667C12.8101 10.5 13.3333 9.97671 13.3333 9.33329V2.33329C13.3333 1.68988 12.8101 1.16663 12.1667 1.16663ZM12.1667 9.33329H4.38907L2.83332 10.5V2.33329H12.1667V9.33329Z"
                    fill="black"
                  />
                </svg>
                <span style={styles.chatileText}>{item.query}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            height: '100vh',
            width: '85%',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              padding: '1rem',
            }}
          >
            <FormControl sx={{ m: 1, minWidth: 180 }} size="small">
              <InputLabel id="demo-select-small-label">Model </InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="demo-select-small"
                value={chosenAI}
                label="Database"
                onChange={handleAiChange}
              >
                <MenuItem value="Claude AI">Claude 3.5</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div style={styles.main}>
            {allAnswers.length < 1 ? (
              <div style={styles.hero}>
                <h1 style={styles.heading}>
                  {isLoadingBD ? <CircularProgress color={'inherit'} size={15} /> : null}
                  <span> Explore {collectionName} Data</span>
                </h1>
                <h3 style={styles.byline}>
                  To start a new chat, either select a preconfigured question or enter a prompt.
                </h3>
                {inputValue === '' && allAnswers.length < 1 ? (
                  <div>
                    <div style={styles.suggestionHolder}>
                      {suggestedPrompts.map((item, index) => (
                        <div onClick={() => autoSubmit(item)} style={styles.promptSuggestion} key={index}>
                          <Typewriter text={item} speed={20} delay={index * 250} />
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
              </div>
            ) : (
              <div
                ref={containerRef}
                className="scrollable-container"
                style={{ maxHeight: '85vh', overflowY: 'auto', padding: '1rem' }}
              >
                {allAnswers.map((item, index) => (
                  <div key={index}>
                    <div style={styles.questionHolder}>
                      <div style={styles.question}>
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
                          <path d="M18 20a6 6 0 0 0-12 0" />
                          <circle cx="12" cy="10" r="4" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                        {item.question}
                      </div>
                    </div>
                    <AIAnswer
                      aiQType={item.topic}
                      userQuestion={item.question}
                      aIAnswer={item.answer}
                      nextQuestion={item.nextQuestion}
                      graph={item.graphPrediction}
                      graphData={item.graphData}
                      onQuestionClick={() => autoSubmit(item.nextQuestion)}
                    />
                  </div>
                ))}
                <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                  <input
                    style={styles.textBox}
                    type="text"
                    value={inputValue}
                    onKeyDown={detectEnterOrTab}
                    onChange={handleInputChange}
                    placeholder="Ask a question or prompt"
                  />
                  <button onClick={handleSubmit} style={{ ...styles.button, backgroundColor }}>
                    {isLoading ? <CircularProgress color={'inherit'} size={20} /> : 'Ask'}
                  </button>
                </div>
              </div>
            )}
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
      </div>
    );
  },
  { displayName: BlockName },
);
