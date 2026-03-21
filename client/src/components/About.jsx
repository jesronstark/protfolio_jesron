import React from 'react';
import { FiMapPin, FiMail, FiTerminal, FiDatabase, FiCloud, FiCheckCircle } from 'react-icons/fi';
import './About.css';

export default function About({ data }) {
  if (!data) return null;

  return (
    <section id="about" className="section container">
      <div className="about-grid">
        <div className="about-content">
          <h2 className="section-title text-gradient">System Overview</h2>
          <p className="about-text">{data.bio}</p>
          <p className="about-text">{data.bio2}</p>
          
          <div className="about-info-grid">
            <div className="info-item">
              <div className="info-icon"><FiMapPin /></div>
              <div className="info-data">
                <span className="info-label">Base Location</span>
                <span className="info-value">{data.location}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><FiCheckCircle /></div>
              <div className="info-data">
                <span className="info-label">Current Status</span>
                <span className="info-value text-gradient">{data.available ? "Operational / Open to Work" : "Current Assignment Active"}</span>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon"><FiMail /></div>
              <div className="info-data">
                <span className="info-label">Digital Comms</span>
                <span className="info-value">{data.email}</span>
              </div>
            </div>
          </div>

          <div className="tags-cluster">
            {data.tags?.map((tag, i) => (
              <span key={i} className="cyber-badge"><FiTerminal size={12}/> {tag}</span>
            ))}
          </div>
        </div>

        <div className="about-viz">
           <div className="glass-panel stat-card">
              <span className="stat-num text-gradient">3+</span>
              <span className="stat-lab">Years Exp</span>
           </div>
           <div className="glass-panel stat-card" style={{borderColor: 'var(--accent-secondary)'}}>
              <span className="stat-num" style={{color: 'var(--accent-secondary)', textShadow: '0 0 20px rgba(255, 0, 85, 0.2)'}}>20+</span>
              <span className="stat-lab">Projects Shipped</span>
           </div>
        </div>
      </div>
    </section>
  );
}
