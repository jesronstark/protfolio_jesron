import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';

const InteractiveBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
      className="interactive-glow" 
      style={{
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`
      }}
    ></div>
  );
};

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-primary">
      <div className="loading-grid"></div>
    </div>
  );

  if (window.location.pathname === '/admin') {
    return <Admin />;
  }

  return (
    <>
      <InteractiveBackground />
      <Navbar hero={data.hero} />
      <Hero data={data.hero} />
      <About data={data.about} />
      <Projects projects={data.projects} />
      <Skills data={data.skills} />
      <Experience data={data.experience} />
      <Contact data={data.contact} />
      <Footer data={data.social} />
    </>
  );
}
