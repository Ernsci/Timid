import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import messages from './messages';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import SearchSection from './components/SearchSection';
import About from './components/About';
import Footer from './components/Footer';
import Particles from './components/Particles';
import FilmGrain from './components/FilmGrain';
import ScrollProgress from './components/ScrollProgress';
import './App.css';

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMood, setActiveMood] = useState('all');
  const searchInputRef = useRef(null);

  const filteredMessages = useMemo(() => {
    let result = messages;
    if (activeMood !== 'all') {
      result = result.filter((m) => m.mood === activeMood);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((m) => m.text.toLowerCase().includes(q));
    }
    return result;
  }, [activeMood, searchQuery]);

  const safeIndex = useMemo(() => {
    if (!filteredMessages.length) return 0;
    if (currentIndex >= filteredMessages.length) return 0;
    return currentIndex;
  }, [currentIndex, filteredMessages]);

  const handleNavigate = useCallback(
    (dir) => {
      if (!filteredMessages.length) return;
      if (dir === 'prev') {
        setCurrentIndex((i) => (i <= 0 ? filteredMessages.length - 1 : i - 1));
      } else if (dir === 'next') {
        setCurrentIndex((i) => (i >= filteredMessages.length - 1 ? 0 : i + 1));
      } else if (dir === 'random') {
        setCurrentIndex(Math.floor(Math.random() * filteredMessages.length));
      }
    },
    [filteredMessages.length]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    setCurrentIndex(0);
  }, []);

  const handleMoodChange = useCallback((mood) => {
    setActiveMood(mood);
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        if (e.key === 'Escape') {
          e.target.blur();
          setSearchQuery('');
          setActiveMood('all');
        }
        return;
      }

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleNavigate('prev');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNavigate('next');
          break;
        case '/':
          e.preventDefault();
          const input = document.querySelector('.search-input');
          if (input) input.focus();
          break;
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleNavigate]);

  useEffect(() => {
    const revealSections = document.querySelectorAll('.section:not(.hero)');
    revealSections.forEach((s) => s.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealSections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <FilmGrain />
      <Particles />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero
          messages={messages}
          filteredMessages={filteredMessages}
          currentIndex={safeIndex}
          onNavigate={handleNavigate}
          totalCount={messages.length}
        />
        <Timeline messages={messages} />
        <SearchSection
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          activeMood={activeMood}
          onMoodChange={handleMoodChange}
          results={filteredMessages}
        />
        <About />
      </main>
      <Footer />
    </>
  );
}
