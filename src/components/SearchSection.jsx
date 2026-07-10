function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

const MOODS = ['All', 'Empty', 'Tired', 'Hope', 'Lonely', 'Reflection'];

function highlight(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

export default function SearchSection({ searchQuery, onSearchChange, activeMood, onMoodChange, results }) {
  return (
    <section id="search-section" className="section">
      <div className="section-header">
        <h2>Search</h2>
        <p className="section-sub">Find a thought that lingers.</p>
      </div>

      <div className="search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder='Type to search... (press "/" to focus)'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="mood-filters">
        {MOODS.map((mood) => (
          <button
            key={mood}
            className={`mood-btn${activeMood === mood.toLowerCase() ? ' active' : ''}`}
            onClick={() => onMoodChange(mood.toLowerCase())}
          >
            {mood}
          </button>
        ))}
      </div>

      <div className="search-results">
        {results.length === 0 ? (
          <p className="no-results">No messages match your search.</p>
        ) : (
          results.map((msg) => (
            <div key={msg.id} className="search-result-card">
              <div className="search-result-date">{formatDate(msg.date)}</div>
              <div className="search-result-mood">{msg.mood}</div>
              <p
                className="search-result-text"
                dangerouslySetInnerHTML={{
                  __html: highlight(msg.text, searchQuery),
                }}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
