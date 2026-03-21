import React from 'react';
import { FiArrowRight, FiTerminal } from 'react-icons/fi';
import { FaWhatsapp, FaGithub } from 'react-icons/fa';
import jesronImage from '../assets/jesron-image.png';
import './Hero.css';

export default function Hero({ data }) {
  if (!data || !data.title) return null;

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid container">
        
        <div className="hero-content">
          <div className="status-badge">
            <span className="pulse-dot"></span> System Online - Accepting Jobs
          </div>
          
          <h1 className="hero-title">{data.name || "System Architecht"}</h1>
          <h2 className="hero-subtitle text-gradient">{data.title}</h2>
          
          <p className="hero-desc">{data.description}</p>
          
          <div className="hero-roles">
            {data.roles?.map((role, idx) => (
              <span key={idx} className="tech-tag"><FiTerminal size={12}/> {role}</span>
            ))}
          </div>

          <div className="hero-actions mt-8">
            <a href="#projects" className="btn btn-primary">
              Initialize Projects <FiArrowRight />
            </a>
            {data.githubUsername && (
              <a href={`https://github/${data.githubUsername}`} target="_blank" rel="noreferrer" className="btn btn-outline">
                <FaGithub size={18} /> Source Code
              </a>
            )}
            <a href="https://wa.me/919629199741" target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <FaWhatsapp size={18} /> Encrypted Comms
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="glass-frame">
             <img 
                src={data.heroImage !== '/profile.jpg' && data.heroImage ? data.heroImage : jesronImage} 
                alt="Jesron Profile" 
                className="hero-pic" 
             />
             <div className="cyber-corner top-left"></div>
             <div className="cyber-corner bottom-right"></div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
