/**
 * This file is part of the NocoBase (R) project.
 * Copyright (c) 2020-2024 NocoBase Co., Ltd.
 * Authors: NocoBase Team.
 *
 * This project is dual-licensed under AGPL-3.0 and NocoBase Commercial License.
 * For more information, please refer to: https://www.nocobase.com/agreement.
 */

const ANTHROPIC_API_KEY =
  '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';

function getReadableDateTime(utcString: string): string {
  const date = new Date(utcString);
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const monthName = month[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const dateString = `${dayOfWeek} ${day} ${monthName}, ${year}`;
  return `${dateString}`;
}

/**
 * Get natural language response given structured results.
 * @param user_question
 * @param info_results
 * @returns
 */

export const getNaturalLangugageAnswer = async (user_question: string, info_results: { [key: string]: string }[]) => {
  const currentDate = new Date();
  const dateString = "Today's date is " + getReadableDateTime(currentDate.toString());
  let info = `${dateString}.\n${info_results.length} pages/sites found.\n`;

  info_results.forEach((resultObj) => {
    for (const key in resultObj) {
      if (key !== 'timeFilterPassed' && key !== 'id') info += key + ' is ' + resultObj[key] + '. ';
    }
    info += ' \n';
  });
  const prompt = `Use the supporting info below to answer the user question below. Be terse. \n\nUser Question:\n${user_question}\n\nSupporting Info:\n${info}`;
  // console.log(prompt);

  const requestBody = {
    model: 'claude-3-haiku-20240307', //'claude-3-sonnet-20240229',
    max_tokens: 1024,
    temperature: 0.0,
    messages: [{ role: 'user', content: prompt }],
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', requestOptions);
  const { content }: { content: { text: string }[] } = await res.json();
  if (content) return content[0].text;
  return '';
};

/**
 * Get natural language response given structured results.
 * @param user_question
 * @param info_results
 * @returns
 */

export const getNaturalLangugageQuestion = async (
  user_question: string,
  info_results: { data: any[]; type: string },
) => {
  let info = `\n`;

  const forbiddenKeys = ['timeFilterPassed', 'id', 'createdAt', 'updatedAt'];

  info_results.data.forEach((resultObj, index) => {
    for (const key in resultObj) {
      if (!forbiddenKeys.includes(key)) info += key + ' is ' + resultObj[key] + '. ';
    }
    info += ' \n\n';
  });

  const topics = Object.keys(info_results.data[0]);
  const topic = topics[Math.floor(topics.length * Math.random())];
  const prompt = `Write a question about the following ${topic} that can be answered by the following ${info_results.type} info:\n${info} \n Be terse. Do not refer to info by number`;
  //console.log(prompt);

  const requestBody = {
    model: 'claude-3-haiku-20240307', //'claude-3-sonnet-20240229',
    max_tokens: 1024,
    temperature: 1,
    messages: [{ role: 'user', content: prompt }],
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const res = await fetch('https://api.anthropic.com/v1/messages', requestOptions);
  const { content }: { content: { text: string }[] } = await res.json();
  if (content) return content[0].text;
  return '';
};
