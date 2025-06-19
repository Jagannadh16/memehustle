import React, { useState, useEffect } from 'react';

const Typewriter = ({ text = '', speed = 80 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayed(text.slice(0, i++));
      if (i > text.length) clearInterval(timer);
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]); // ✅ ESLint warning fixed

  return (
    <span className="text-neon-pink font-mono text-xl">
      {displayed}
      <span className="animate-pulse text-neon-blue">|</span> {/* Glitchy terminal cursor */}
    </span>
  );
};

export default Typewriter;
