import React from 'react';
import { FiGithub, FiLinkedin, FiTwitter, FiInstagram, FiMail } from 'react-icons/fi';

import './Footer.css';

export default function Footer({ data }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h2 className="footer-logo text-gradient">Jesron R</h2>
            <p className="footer-subtitle">
              Building the backbone of modern web applications with high-concurrency Node.js systems and distributed cloud infrastructures.
            </p>
            <div className="footer-social">
               {data?.github && <a href={data.github} target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding: '10px'}}><FiGithub /></a>}
               {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noreferrer" className="btn btn-outline" style={{padding: '10px'}}><FiLinkedin /></a>}
            </div>
          </div>

          <div className="footer-section">
             <h4 className="footer-section-title">Navigation</h4>
             <ul className="footer-links">
                <li><a href="#home">Terminal Root</a></li>
                <li><a href="#projects">Deployments</a></li>
                <li><a href="#about">Overview</a></li>
                <li><a href="#skills">Arsenal</a></li>
             </ul>
          </div>

          <div className="footer-section">
             <h4 className="footer-section-title">Legal Comms</h4>
             <ul className="footer-links">
                <li><a href="mailto:Jesronstark@gmail.com">Jesronstark@gmail.com</a></li>
                <li><a href="https://wa.me/919629199741">+91 96291 99741</a></li>
                <li><a href="#contact">Dispatch Protocol</a></li>
             </ul>
          </div>

        </div>

        <div className="footer-bottom">
           <p>&copy; {currentYear} Jesron R • MERN Cloud Specialist</p>
           <div className="flex gap-4">
              <a href="/">Privacy</a>
              <a href="/">Security</a>
              <a href="/admin" style={{ opacity: 0.1, cursor: 'default' }}>jesron</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
