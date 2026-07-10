import { useState, useEffect, useCallback } from 'react';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function Hero({ messages, filteredMessages, currentIndex, onNavigate, totalCount }) {
  const [phase, setPhase] = useState('visible');
  const [displayMsg, setDisplayMsg] = useState(null);

  const msg = filteredMessages[currentIndex];

  useEffect(() => {
    if (!msg) return;
    setPhase('fade-out');
    const t = setTimeout(() => {
      setDisplayMsg(msg);
      setPhase('visible');
    }, 300);
    return () => clearTimeout(t);
  }, [msg]);

  useEffect(() => {
    if (!filteredMessages.length) {
      setDisplayMsg(null);
      setPhase('visible');
    }
  }, [filteredMessages.length]);

  return (
    <section id="home" className="section hero">
      <div className="hero-content">
        <h1 className="hero-title">Timid</h1>

        <div className={`message-display ${phase === 'fade-out' ? 'fade-out' : ''}`}>
          {displayMsg ? (
            <>
              <p className="message-text">{displayMsg.text}</p>
              <span className="message-date">{formatDate(displayMsg.date)}</span>
            </>
          ) : (
            <p className="message-text" style={{ color: 'var(--text-muted)' }}>
              No messages found.
            </p>
          )}
        </div>

        <div className="hero-nav">
          <button className="btn-nav" onClick={() => onNavigate('prev')}>Previous</button>
          <span className="hero-nav-sep">·</span>
          <button className="btn-nav" onClick={() => onNavigate('next')}>Next</button>
          <span className="hero-nav-sep">·</span>
          <button className="btn-nav" onClick={() => onNavigate('random')}>Random</button>
        </div>

        <span className="message-count">
          {totalCount} message{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
    </section>
  );
}
