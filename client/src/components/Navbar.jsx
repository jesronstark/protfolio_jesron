import React, { useState, useEffect } from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiMenu, FiX } from 'react-icons/fi';
import './Navbar.css';

export default function Navbar({ social, hero }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled glass-panel' : ''}`}>
      <div className="container nav-container">
        <a href="#home" className="nav-logo">
          <span className="text-gradient" style={{ letterSpacing: '4px', textTransform: 'uppercase' }}>
             {hero?.name || "J·S"}
          </span>
        </a>
        
        <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <li><a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a></li>
          <li><a href="#skills" onClick={() => setMobileMenuOpen(false)}>Skills</a></li>
          <li><a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a></li>
          <li><a href="#experience" onClick={() => setMobileMenuOpen(false)}>Experience</a></li>
          <li><a href="#contact" className="btn btn-outline" onClick={() => setMobileMenuOpen(false)}>Contact Me</a></li>
        </ul>

        <div className="nav-social">
          {social?.github && <a href={social.github} target="_blank" rel="noreferrer"><FiGithub /></a>}
          {social?.linkedin && <a href={social.linkedin} target="_blank" rel="noreferrer"><FiLinkedin /></a>}
          {social?.twitter && <a href={social.twitter} target="_blank" rel="noreferrer"><FiTwitter /></a>}
        </div>

        <button className="mobile-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
}
