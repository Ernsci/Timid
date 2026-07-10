import { useEffect, useRef } from 'react';

const LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Search', href: '#search-section' },
  { label: 'About', href: '#about' },
];

export default function Nav({ activeSection }) {
  const sectionsRef = useRef([]);

  useEffect(() => {
    const sectionElements = LINKS.map(link =>
      document.querySelector(link.href)
    ).filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            sectionsRef.current.forEach((btn, i) => {
              const isActive = LINKS[i]?.href === `#${id}`;
              btn?.classList.toggle('active', isActive);
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    sectionElements.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="nav">
      <div className="nav-inner">
        <span className="nav-logo">Timid</span>
        <div className="nav-links">
          {LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`nav-link${i === 0 ? ' active' : ''}`}
              ref={(el) => (sectionsRef.current[i] = el)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
