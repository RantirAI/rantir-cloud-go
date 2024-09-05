import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayText('');

    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(intervalId);
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay]);

  return <div>{displayText}</div>;
};

export default Typewriter;
