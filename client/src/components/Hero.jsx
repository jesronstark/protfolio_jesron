import React from 'react';
import { FiArrowRight, FiDownload } from 'react-icons/fi';
import './Hero.css';
import profileImage from '../assets/jesron-image.png';

export default function Hero({ data }) {
  if (!data) return null;

  return (
    <section id="home" className="hero section">
      <div className="container hero-container grid">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up">
            <span className="blob"></span>
            Available for work
          </div>
          
          <h1 className="hero-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <span className="text-secondary">{data.title.split(' ')[0]} {data.title.split(' ')[1]}</span><br />
            <span className="text-gradient">{data.name}</span>
          </h1>
          
          <h2 className="hero-subtitle animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {data.subtitle}
          </h2>
          
          <p className="hero-desc animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {data.description}
          </p>

          <div className="hero-roles animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {data.roles?.map((role, idx) => (
              <span key={idx} className="role-tag">{role}</span>
            ))}
          </div>
          
          <div className="hero-actions animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <a href="#projects" className="btn btn-primary">
              View Work <FiArrowRight />
            </a>
            <a href={data.resumeLink} target="_blank" rel="noreferrer" className="btn btn-outline">
              Resume <FiDownload />
            </a>
          </div>
        </div>

        <div className="hero-visual animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="profile-wrapper">
             <div className="profile-glow"></div>
             {/* If window.PROFILE_IMAGE is defined, it will use that from index.html, else placeholder */}
             <img src={profileImage} alt={data.name} className="profile-img" />
             <div className="tech-orbit orbit-1"><span>⚛️</span></div>
             <div className="tech-orbit orbit-2"><span>🟢</span></div>
             <div className="tech-orbit orbit-3"><span>🍃</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
