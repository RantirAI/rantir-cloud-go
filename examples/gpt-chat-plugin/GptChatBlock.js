import React, { useState } from 'react';
import axios from 'axios';

const GptChatBlock = ({ collection }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
      prompt: input,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
      },
    });

    const newMessage = {
      role: 'assistant',
      content: response.data.choices[0].text,
    };

    setMessages([...messages, { role: 'user', content: input }, newMessage]);
    setInput('');
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '10px', borderRadius: '5px' }}>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <div key={index} style={{ margin: '10px 0' }}>
            <strong>{message.role}:</strong> {message.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, marginRight: '10px' }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GptChatBlock;
