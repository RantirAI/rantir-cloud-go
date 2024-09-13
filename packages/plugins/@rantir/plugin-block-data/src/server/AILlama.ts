import { GROQ_API_KEY } from './credentials';

const endpoint = `https://api.groq.com/openai/v1/chat/completions`;

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
  dbColumns: any[],
  collection: any,
) => {
  const ops = ['average', 'maximum', 'minimum', 'sum', 'count', 'selection'];
  const stat_ops = ['greater', 'lesser', 'between', 'equals', 'not equals'];
  const topics = dbColumns.map((column) => {
    return `${column.name} - ${column.description}`;
  });

  const columnNames = dbColumns.map((column) => {
    return column.name;
  });

  const messages = [
    {
      role: 'system',
      content:
        'You are an data assistant. You can perform selection, filtering and statistical operations on columns in table. Here is a description of the table. ' +
        topics,
    },
    {
      role: 'user',
      content: user_question,
    },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'get_stats',
        description: `Perform selection on columns in table. \n
        Operations to perform include ${ops.join(', ')} on Columns like ${columnNames.join(', ')}. `,
        parameters: {
          type: 'object',
          properties: {
            operation: {
              type: 'string',
              description: `The statistical operation to perform. They should strictly be any of: ${ops.join(', ')}`,
            },
            topic: {
              type: 'string',
              description: 'The name of column whose value is numerical. Options are ' + columnNames.join(', '),
            },
          },
          required: ['operation', 'topic'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_filters',
        description: `Perform filtering on a columns in table. \n
        Columns include ${columnNames.join(', ')}. `,
        parameters: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: `The name of columns which is used to filter data to a selection.They should strictly be any of: ${columnNames.join(
                ', ',
              )}`,
            },
            operation: {
              type: 'string',
              enum: stat_ops,
              description: 'The operation to perform on the filter values.',
            },
            value: {
              type: 'string',
              description: 'The value to filter with.',
            },
            required: ['name', 'operation', 'value'],
          },
        },
      },
    },
  ];

  const requestBody_filter = {
    model: 'llama3-groq-70b-8192-tool-use-preview',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'get_filters' } },
    max_tokens: 4096,
    temperature: 0,
  };

  const requestBody_stat = {
    model: 'llama3-groq-70b-8192-tool-use-preview',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'get_stats' } },
    max_tokens: 4096,
    temperature: 0,
  };

  const requestOptions_stat = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + GROQ_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody_stat),
  };

  const requestOptions_filter = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + GROQ_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody_filter),
  };

  const res = await fetch(endpoint, requestOptions_stat);
  const data = await res.json();

  const resFilter = await fetch(endpoint, requestOptions_filter);
  const filterInstructions = await resFilter.json();

  const output_stat = JSON.parse(data.choices[0].message.tool_calls[0].function.arguments);
  const output_filters = filterInstructions.choices[0].message.tool_calls.map((tool) => {
    return JSON.parse(tool.function.arguments);
  });

  const instruction = {
    input: {
      operation: output_stat.operation,
      topic: output_stat.topic,
      filter: output_filters,
    },
  };

  // console.log(JSON.stringify(instruction, null, 2));

  const text = await filterData(collection, instruction);
  // console.log(text);
  return text;
};

/**
 * Get natural language response given structured results.
 * @param user_question
 * @param info_results
 * @returns
 */

export const getNaturalLangugageQuestion = async (dbColumns: any[], info_results: any[], numQuestions?: number) => {
  let info = ``;

  info_results.forEach((resultObj) => {
    info += resultObj.doc;
    info += ' \n\n';
  });

  const topics = dbColumns.map((column) => {
    return column.name;
  });
  const topic = topics[Math.floor(Math.random() * topics.length)];

  let prompt = `Write a question on the following topic ${topic} that can be answered by the following info:\n${info} \n  Do not refer to info by number. Be terse. Reply with question text only.`;
  if (numQuestions > 0) {
    prompt = `Write ${numQuestions} questions on that can be answered by the following info:\n${info} Refrain from questions with data meant for computers such as ids. Reply strictly with JSON in the following fomart: {questions: ["question1", "question2", ...]} .`;
  }
  //console.log(prompt);
  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant.',
    },
    {
      role: 'user',
      content: prompt,
    },
  ];

  const requestBody = {
    model: 'llama-3.1-70b-versatile',
    messages,
    max_tokens: 4096,
    top_p: 0.1,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + GROQ_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const res = await fetch(endpoint, requestOptions);
  const data = await res.json();
  const qDataSource = data.choices[0].message.content;
  return qDataSource;
};

/**
 * Get graph given user question.
 * @param user_question
 * @param graphName
 * @param info_results
 * @returns
 */
export const getGraphData = async (user_question: string, info_results: any, dbColumns: any[], collection: any) => {
  const columnNames = dbColumns.map((column) => {
    return column.name;
  });

  const messages = [
    {
      role: 'system',
      content: 'You are a helpful assistant. You help visualize data by defining chart',
    },
    {
      role: 'user',
      content: user_question,
    },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'build_chart',
        description: `Get the necessary variables needed to build a chart. Variables include ${columnNames.join(', ')}`,
        parameters: {
          type: 'object',
          properties: {
            chart_type: {
              type: 'string',
              enum: ['pie', 'bar', 'timeline', 'scatter', 'list'],
              description: 'The type of chart to build.',
            },

            columns: {
              description: `an array of objects containing column names extracted from ${columnNames.join(', ')}. 
              The "list" column name is always accompanied by other complementary column name.`,
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  columnName: {
                    type: 'string',
                    enum: columnNames,
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
    },
  ];

  const requestBody = {
    model: 'llama3-groq-70b-8192-tool-use-preview',
    messages,
    tools,
    tool_choice: { type: 'function', function: { name: 'build_chart' } },
    max_tokens: 4096,
  };

  const requestOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + GROQ_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  };

  const res = await fetch(endpoint, requestOptions);
  const reply = await res.json();
  console.log(reply);

  const instruction = JSON.parse(reply.choices[0].message.tool_calls[0].function.arguments);
  console.log(JSON.stringify(instruction, null, 2));

  const graphType = instruction.chart_type;
  if (graphType === 'bar' || graphType === 'pie') {
    let values = [];
    let labels = [];
    const columns = [];

    instruction.columns.forEach(async ({ columnName }) => {
      columns.push(columnName);
    });

    const filteredData = await collection.repository.find({
      fields: columns,
    });

    instruction.columns.forEach(async ({ columnName, islabel, operation }) => {
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

    instruction.columns.forEach(async ({ columnName }) => {
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
