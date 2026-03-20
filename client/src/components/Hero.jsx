import React from 'react';
import { FiArrowRight } from 'react-icons/fi';
import './Hero.css';

export default function Hero({ data }) {
  if (!data || !data.title) return null;

  return (
    <section id="home" className="hero section">
      <div className="container">
        
        <div className="hero-text-content animate-fade-in-up">
          <h2 className="hero-subtitle text-secondary" style={{ animationDelay: '0.1s' }}>
            {data.subtitle || "Welcome to my portfolio"}
          </h2>
          
          <h1 className="hero-title text-gradient" style={{ animationDelay: '0.2s' }}>
            {data.title || "Elite Experience"}
          </h1>
          
          <p className="hero-desc text-muted" style={{ animationDelay: '0.3s' }}>
            {data.description || "Crafting digital luxury and robust backend systems."}
          </p>

          <div className="hero-actions" style={{ animationDelay: '0.4s' }}>
            <a href="#projects" className="btn btn-primary">
              View Collection <FiArrowRight />
            </a>
          </div>
        </div>

        <div className="hero-visual-bottom animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <div className="hero-image-wrapper">
             {/* Uses the provided picture, placed 'down side', fading out at the bottom */}
             <img 
                src={window.PROFILE_IMAGE || "/profile.jpg"} 
                alt="Portrait" 
                className="hero-large-img" 
                onError={(e) => { e.target.src = 'https://i.ibb.co/L5hYhY3/profile-placeholder.jpg' }}
             />
             <div className="hero-image-fade"></div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
