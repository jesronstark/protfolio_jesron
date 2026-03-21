import React from 'react';
import { FiArrowRight, FiMail } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import './Hero.css';

export default function Hero({ data }) {
  if (!data) return null;

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid container">
        
        <div className="hero-content animate-fade-in-up">
          <div className="hero-badge">
            <span className="live-dot"></span> Available for work
          </div>
          
          <h1 className="hero-title">{data.title || "Software Engineer"}</h1>
          <h2 className="hero-subtitle text-gradient">{data.subtitle}</h2>
          
          <p className="hero-desc">{data.description}</p>
          
          <div className="hero-roles">
            {data.roles?.map((role, idx) => (
              <span key={idx} className="tech-tag">{role}</span>
            ))}
          </div>

          <div className="hero-actions mt-6">
            <a href="#projects" className="btn btn-primary">
              View Projects <FiArrowRight />
            </a>
            <a href="https://wa.me/919629199741" target="_blank" rel="noreferrer" className="btn btn-whatsapp">
              <FaWhatsapp size={18} /> WhatsApp
            </a>
            <a href="mailto:Jesronstark@gmail.com" className="btn btn-outline">
              <FiMail size={18} /> Email
            </a>
          </div>
        </div>

        <div className="hero-visual animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="pic-wrapper">
             <img 
                src={window.PROFILE_IMAGE || "/profile.jpg"} 
                alt="Jesron" 
                className="full-size-pic" 
                onError={(e) => { e.target.src = 'https://i.ibb.co/L5hYhY3/profile-placeholder.jpg' }}
             />
             <div className="pic-backdrop"></div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
