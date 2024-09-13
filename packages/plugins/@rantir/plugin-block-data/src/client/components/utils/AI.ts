const endpoint = 'https://api.rantir.com/';
// const endpoint = 'http://127.0.0.1:5000';

export const getAIAnswer = async (question: string, dbColumns: any[], collection: string, token: string) => {
  const info = await getSearchPrediction(question, collection);
  const resp = await fetch('/api/ai:ask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      question,
      info,
      dbColumns,
      collection,
      nextQDataSource: info,
    }),
  });

  const { data } = await resp.json();
  return data;
};

export const getAIQuestions = async (dbColumns: any[], numQuestions: number, info: any, token: string) => {
  const resp = await fetch('/api/ai:info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      info,
      dbColumns,
      numQuestions,
    }),
  });

  const { data } = await resp.json();
  return data;
};

const getSearchPrediction = async (question: string, collection: string) => {
  const body = {
    question,
    collection,
  };

  const resp = await fetch(endpoint + '/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const { results } = await resp.json();
  return results;
};

export const addLog = async (
  collection: string,
  question: string,
  answer: string,
  chatid: string,
  isfirst: string,
  graphData: string,
  graphPrediction: string,
) => {
  const body = {
    collection,
    question,
    answer,
    chatid,
    isfirst,
    graphData,
    graphPrediction,
  };

  const resp = await fetch(endpoint + '/addlog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const results = await resp.json();
  return results;
};

export const getLogs = async (collection: string, chatid: string) => {
  const body = {
    collection,
    chatid,
  };

  const resp = await fetch(endpoint + '/getLog', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const results = await resp.json();
  return results;
};

export const getFirstChats = async (collection: string) => {
  const body = {
    collection,
  };

  const resp = await fetch(endpoint + '/getFirstChats', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const results = await resp.json();
  return results;
};

export const isVectorSetup = async (collection: string) => {
  const body = {
    collection,
  };

  const resp = await fetch(endpoint + '/checkData', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const results = await resp.json();
  return results;
};

export const setUpVectors = async (collection: string, data: string[]) => {
  const body = {
    collection,
    data,
  };

  const resp = await fetch(endpoint + '/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const results = await resp.json();
  return results;
};

export const setUpBatchVectors = async (collection: string, data: string[]) => {
  const body = {
    collection,
    data,
  };

  // split data into chunks of 1000
  const chunkSize = 1000;
  const chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }

  const responses = [];
  // use promise.all to send all requests at once
  await Promise.all(
    chunks.map(async (chunk) => {
      const resp = await fetch(endpoint + '/generateBatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collection, data: chunk }),
      });

      responses.push(await resp.json());
    }),
  );
  const result = { message: 'fail' };
  // loop through responses to check if all were successful
  responses.forEach((res) => {
    if (res.message === 'success') {
      result.message = 'success';
    }
  });

  return result;
};
