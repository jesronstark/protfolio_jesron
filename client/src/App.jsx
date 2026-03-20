import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Admin from './components/Admin';

function Portfolio({ data }) {
  if (!data) return (
    <div className="flex justify-center items-center" style={{ height: '100vh', width: '100vw' }}>
      <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }}></div>
    </div>
  );

  return (
    <>
      <div className="bg-mesh"></div>
      <Navbar social={data.social} hero={data.hero} />
      <main>
        <Hero data={data.hero} />
        <About data={data.about} />
        <Skills data={data.skills} />
        <Experience data={data.experience} />
        <Projects projects={data.projects} />
        <Contact data={data.contact} />
      </main>
      <Footer data={data.social} />
    </>
  );
}

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Portfolio data={data} />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;
