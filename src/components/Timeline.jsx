import { useEffect, useRef } from 'react';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function Timeline({ messages }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll('.timeline-card');
    const observers = [];

    cards.forEach((card) => {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              card.classList.add('visible');
              obs.unobserve(card);
            }
          });
        },
        { threshold: 0.15 }
      );
      obs.observe(card);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [messages]);

  const sorted = [...messages].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <section id="timeline" className="section">
      <div className="section-header">
        <h2>Timeline</h2>
        <p className="section-sub">Every thought, in order.</p>
      </div>
      <div className="timeline-container" ref={containerRef}>
        {sorted.map((msg) => (
          <div key={msg.id} className="timeline-card">
            <div className="timeline-card-top">
              <span className="timeline-date">{formatDate(msg.date)}</span>
              <span className="timeline-mood">{msg.mood}</span>
            </div>
            <p className="timeline-text">{msg.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
