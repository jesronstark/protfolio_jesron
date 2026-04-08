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
import { data } from './data';

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
  return (
    <>
      <InteractiveBackground />
      <Navbar hero={data.hero} social={data.social} />
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
