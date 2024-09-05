import { ANTHROPIC_API_KEY } from './credentials';

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

export const getNaturalLangugageAnswer = async (
  user_question: string,
  info_results: any,
  topics: string[],
  collection: any,
) => {
  const currentDate = new Date();
  const dateString = "Today's date is " + getReadableDateTime(currentDate.toString());
  topics = topics.filter((topic) => !topic.includes('{{'));

  let info = `${dateString}.\n${info_results.length} results found.\n`;

  info_results.forEach((resultObj) => {
    info += resultObj.doc;
    info += ' \n';
  });

  const prompt = `Use the supporting info, only if possible, to answer the user question below. Be terse. \n\nUser Question:\n${user_question}\n\nSupporting Info:\n${info}`;
  const ops = ['average', 'maximum', 'minimum', 'sum', 'count', 'selection'];

  const requestBody = {
    model: 'claude-3-haiku-20240307', //'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    temperature: 0.0,
    messages: [{ role: 'user', content: user_question }],
    tools: [
      {
        name: 'get_stats',
        description: `Perform selection, filtering and statistical operations on a columns in table. \n
        Operations to perform include ${ops.join(', ')} on Columns like ${topics.join(', ')}. `,
        input_schema: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              enum: ops,
              description: `The statistical operation to perform on any of the following columns: ${topics.join(', ')}`,
            },
            topic: {
              type: 'string',
              enum: topics,
              description: 'The name of column whose value is numerical',
            },
            filter: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    enum: topics,
                    description: 'The name of columns which is used to filter data to a selection.',
                  },
                  operation: {
                    type: 'string',
                    enum: ['greater', 'lesser', 'between', 'equals', 'not equals'],
                    description: 'The operation to perform on the filter values.',
                  },
                  value: {
                    type: 'string',
                    description: 'The value to filter with.',
                  },
                },
                required: ['name', 'operation', 'value'],
              },
            },
          },
          required: ['operation', 'topic'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'get_stats' },
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
  const data = await res.json();
  const { content }: { content: { text: string }[] } = data;

  const toolUseObj = content.find((obj: any) => obj.type === 'tool_use');
  if (toolUseObj) {
    const text = await filterData(collection, toolUseObj);
    return text;
  }
  if (content) return content[0].text;
  return '';
};

/**
 * Get natural language response given structured results.
 * @param user_question
 * @param info_results
 * @returns
 */

export const getNaturalLangugageQuestion = async (topics: string[], info_results: any[], numQuestions?: number) => {
  let info = ``;

  info_results.forEach((resultObj) => {
    info += resultObj.doc;
    info += ' \n\n';
  });

  const topic = topics[Math.floor(Math.random() * topics.length)];

  let prompt = `Write a question on the following topic ${topic} that can be answered by the following info:\n${info} \n  Do not refer to info by number. Be terse. Reply with question text only.`;
  if (numQuestions > 0) {
    prompt = `Write ${numQuestions} questions on that can be answered by the following info:\n${info} Refrain from questions with data meant for computers such as ids. Reply strictly with JSON in the following fomart: {questions: ["question1", "question2", ...]} .`;
  }
  //console.log(prompt);

  const requestBody = {
    model: 'claude-3-5-sonnet-20240620',
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

/**
 * Get graph given user question.
 * @param user_question
 * @param graphName
 * @param info_results
 * @returns
 */
export const getGraphData = async (user_question: string, info_results: any, topics: string[], collection: any) => {
  let info = '';
  info_results.forEach((resultObj) => {
    info += resultObj.doc;
    info += ' \n';
  });

  topics = topics.filter((topic) => !topic.includes('{{'));

  const requestBody = {
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    temperature: 1,
    messages: [{ role: 'user', content: user_question }],
    tools: [
      {
        name: 'build_chart',
        description: `Get the necessary variables needed to build a chart. Variables include ${topics.join(', ')}`,
        input_schema: {
          type: 'object',
          properties: {
            chart_type: {
              type: 'string',
              enum: ['pie', 'bar', 'timeline', 'scatter', 'list'],
              description: 'The type of chart to build.',
            },

            columns: {
              description: `an array of objects containing column names extracted from ${topics.join(', ')}. 
              The "list" column name is always accompanied by other complementary column name.`,
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  columnName: {
                    type: 'string',
                    enum: topics,
                    description: 'The name of column to extract values from.',
                  },
                  operation: {
                    type: 'string',
                    description:
                      'statistic operation, if any, to peform on extracted column. count operation is used in bar and pie chart only.',
                    enum: ['count', 'none'],
                  },
                  islabel: {
                    type: 'string',
                    enum: ['yes', 'no'],
                    description: 'Whether column is to be used as a label axis in the chart',
                  },
                },
              },
            },
          },
          required: ['chart_type', 'columns'],
        },
      },
    ],
    tool_choice: { type: 'tool', name: 'build_chart' },
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
  const reply = await res.json();
  // const { content }: { content: { text: string }[] } = reply;
  // console.log(JSON.stringify(reply, null, 2));

  const graphType = reply.content[0].input.chart_type;
  if (graphType === 'bar' || graphType === 'pie') {
    let values = [];
    let labels = [];
    const columns = [];

    reply.content[0].input.columns.forEach(async ({ columnName }) => {
      columns.push(columnName);
    });

    const filteredData = await collection.repository.find({
      fields: columns,
    });

    reply.content[0].input.columns.forEach(async ({ columnName, islabel, operation }) => {
      if (operation === 'count') {
        const counter = {};
        const data = filteredData.map((data) => {
          return data.dataValues[columnName];
        });

        data.forEach((ele) => {
          if (counter[ele]) {
            counter[ele] += 1;
          } else {
            counter[ele] = 1;
          }
        });

        labels = Object.keys(counter);
        values = labels.map((label) => counter[label]);

        return;
      }
      if (islabel === 'yes') {
        labels = filteredData.map((data) => {
          return data.dataValues[columnName];
        });
      } else {
        values = filteredData.map((data) => {
          return data.dataValues[columnName];
        });
      }
    });

    // console.log({ labels, values, graphType });

    return JSON.stringify({ labels, values, graphType });
  }

  if (graphType === 'list') {
    const values = [];
    const labels = [];

    reply.content[0].input.columns.forEach(async ({ columnName }) => {
      labels.push(columnName);
    });

    const filteredData = await collection.repository.find({
      fields: labels,
    });

    labels.forEach(async (columnName) => {
      const val = filteredData.map((data) => {
        return data.dataValues[columnName];
      });

      values.push(val);
    });

    // console.log({ labels, values, graphType });
    return JSON.stringify({ labels, values, graphType });
  }

  return '';
};

/**
 * Get graph given user question.
 * @param user_question
 * @param graphName
 * @param info_results
 * @returns
 */
export const getGraphData2 = async (user_question: string, graphName: string, info_results: any) => {
  let info = '';
  info_results.forEach((resultObj) => {
    info += resultObj.doc;
    info += ' \n';
  });

  let dataFormat = '';

  if (graphName === 'pie' || graphName === 'bar') {
    dataFormat = 'labels: (list), values: (list of numbers) and “graphType“ (string)';
  }
  if (graphName === 'timeline') {
    dataFormat = 'values: (list of strings) and labels: (list of names) and “graphType“ (string)';
  }
  if (graphName === 'scatter') {
    dataFormat =
      'x: (list of numbers from column A), y: (list of numbers from column B), labels: (list) and “graphType“ (string). If columns are time, convert them to month';
  }
  if (graphName === 'list') {
    dataFormat = 'columnNames: (list), values: (list of lists) and “graphType“ (string)';
  }

  let prompt = `Extract data from the following supporting info, to create a ${graphName} chart, that answers the following question ${user_question} \n\n
  Supporting Info:\n${info} \n Reply strictly in the following JSON format with keys: ${dataFormat}. \n\n`;

  if (graphName === 'list') {
    prompt = `Extract data from the following supporting info, to create a list that answers the following question ${user_question} \n\n
    Supporting Info:\n${info} \n Reply strictly in the following JSON format with keys: ${dataFormat}. \n\n`;
  }

  const requestBody = {
    model: 'claude-3-5-sonnet-20240620',
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

const filterData = async (collection: any, filter: any) => {
  const filterX: any = {};

  await filter.input?.filter?.forEach((fl) => {
    if (fl.operation === 'equals') {
      const date = new Date(fl.value);
      const isDate = !isNaN(date.getTime());
      if (isDate) {
        const filterObject = {};
        filterObject['$dateOn'] = date;
        filterX[fl.name] = filterObject;
      } else {
        const filterObject = {};
        filterObject['$includes'] = fl.value;
        filterX[fl.name] = filterObject;
      }
    }
    if (fl.operation === 'not equals') {
      const filterObject = {};
      filterObject['$ne'] = fl.value;
      filterX[fl.name] = filterObject;
    }
    if (fl.operation === 'greater') {
      const date = new Date(fl.value);
      const num = parseFloat(fl.value);
      const isDate = !isNaN(date.getTime());

      const btwFilterObject = {};
      btwFilterObject['$gte'] = isDate ? date : num;
      filterX[fl.name] = btwFilterObject;
    }
    if (fl.operation === 'lesser') {
      const date = new Date(fl.value);
      const num = parseFloat(fl.value);
      const isDate = !isNaN(date.getTime());

      const btwFilterObject = {};
      btwFilterObject['$lte'] = isDate ? date : num;
      filterX[fl.name] = btwFilterObject;
    }
    if (fl.operation === 'between') {
      const date = new Date(fl.value.split(',')[0]);
      const date2 = new Date(fl.value.split(',')[1]);
      const num = parseFloat(fl.value.split(',')[0]);
      const num2 = parseFloat(fl.value.split(',')[1]);
      const isDate = !isNaN(date.getTime());
      const isDate2 = !isNaN(date2.getTime());

      if (isDate && isDate2) {
        const btwFilterObject = [{ [fl.name]: { $dateBefore: date2 } }, { [fl.name]: { $dateAfter: date } }];
        filterX['$and'] = btwFilterObject;
      } else {
        const btwFilterObject: any = { $between: [num, num2] };
        filterX[fl.name] = btwFilterObject;
      }
    }
  });

  let values = [];

  const filteredData = await collection.repository.find({
    filter: filterX,
  });

  values = filteredData.map((data) => {
    return data.dataValues[filter.input.topic];
  });

  // console.log(JSON.stringify(filter, null, 2));

  if (values.length === 0) {
    return ``;
  }

  if (filter.input.operation === 'average') {
    const sum = values.reduce((acc, num) => acc + num, 0);
    const av = sum / values.length;
    const average = Number(av.toFixed(4));

    return `The average of ${filter.input.topic} is ${average}`;
  }
  if (filter.input.operation === 'sum') {
    const sum = values.reduce((acc, num) => acc + num, 0);

    return `The sum of ${filter.input.topic} is ${sum}`;
  }

  if (filter.input.operation === 'count') {
    const sum = values.length;

    return `The total is ${sum}`;
  }

  if (filter.input.operation === 'maximum') {
    return `The highest ${filter.input.topic} is ${Math.max(...values)}`;
  }
  if (filter.input.operation === 'minimum') {
    return `The lowest ${filter.input.topic} is ${Math.min(...values)}`;
  }
  if (filter.input.operation === 'selection') {
    return `${values}`;
  }
  return '';
};
